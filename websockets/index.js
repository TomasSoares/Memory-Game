const { createLobby } = require('./lobby')
const lobby = createLobby()
const { createUtil } = require('./util')
const util = createUtil()
const { createGameEngine } = require('./gameEngine')
const gameEngine = createGameEngine()

const httpServer = require('http').createServer()
const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
})

httpServer.listen(8083, () => {
    console.log('listening on *:8083')
})

io.on('connection', (socket) => {
    console.log(`Client with socket id ${socket.id} has connected!`)

    // ------------------------------------------------------
    // Disconnect
    // ------------------------------------------------------
    // disconnection event is triggered when the client disconnects but is still on the rooms

    socket.on("disconnecting", (reason) => {
        socket.rooms.forEach(room => {
            if (room == 'lobby') {
                lobby.leaveLobby(socket.id)
                io.to('lobby').emit('lobbyChanged', lobby.getGames())
            }
        })

        util.getRoomGamesPlaying(socket).forEach(([roomName, room]) => {
            socket.leave(roomName)
            if (!gameEngine.gameEnded(room.game)) {
                room.game.status = 'interrupted'
                room.game.gameStatus = 3
                io.to(roomName).emit('gameInterrupted', room.game)
            }
        })
    })



    // ------------------------------------------------------
    // User identity
    // ------------------------------------------------------

    socket.on('login', (user) => {
        // Stores user information on the socket as "user" property
        socket.data.user = user
        if (user && user.id) {
            socket.join('user_' + user.id)
            socket.join('lobby')
        }
    })

    socket.on('logout', (user) => {
        if (user && user.id) {
            socket.leave('user_' + user.id);
            lobby.leaveLobby(socket.id);
            io.to('lobby').emit('lobbyChanged', lobby.getGames());
            socket.leave('lobby');
    
            util.getRoomGamesPlaying(socket).forEach(([roomName, room]) => {
                socket.leave(roomName);
                if (!gameEngine.gameEnded(room.game)) {
                    room.game.status = 'interrupted';
                    room.game.gameStatus = 3;
                    io.to(roomName).emit('gameInterrupted', room.game);
                }
            });
        }
        socket.data.user = undefined;
    });
    


// ------------------------------------------------------
// Lobby
// ------------------------------------------------------

socket.on('fetchGames', (callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const games = lobby.getGames()
    if (callback) {
        callback(games)
    }
})


socket.on('addGame', (board, gameAPI, callback) => {
    if (!util.checkAuthenticatedUser( socket, callback)) {
        return
    }
    const game = lobby.addGame(socket.data.user, board, gameAPI, socket.id)
    console.log(game.players)
    io.to('lobby').emit('lobbyChanged', lobby.getGames())
    if (callback) {
        callback(game)
    }
})

socket.on('joinGame', (id, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const game = lobby.getGame(id)
    if (socket.data.user.id == game.players[0].user.id) {
        if (callback) {
            callback({
                errorCode: 3,
                errorMessage: 'User cannot join a game that he created!'
            })
        }
        return
    }
    game.players.push({ user: socket.data.user, socketId: socket.id })
    io.to('lobby').emit('lobbyPlayerGameChange', lobby.getGame(id))
    if (callback) {
        callback(game)
    }
})

socket.on('removeGame', (id, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const game = lobby.getGame(id)
    if (socket.data.user.id != game.players[0].user.id) {
        if (callback) {
            callback({
                errorCode: 4,
                errorMessage: 'User cannot remove a game that he has not created!'
            })
        }
        return
    }
    lobby.removeGame(game.id)
    io.to('lobby').emit('lobbyChanged', lobby.getGames())
    if (callback) {
        callback(game)
    }
})

socket.on('removePlayer', (gameid, userid, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const game = lobby.getGame(gameid)
    if (socket.data.user.id != game.players[0].user.id) {
        if (callback) {
            callback({
                errorCode: 4,
                errorMessage: 'User cannot remove a player!'
            })
        }
        return
    }
    lobby.removePlayer(gameid, userid)
    io.to('lobby').emit('lobbyPlayerGameChange', lobby.getGame(gameid))
    if (callback) {
        callback(game)
    }
})

// ------------------------------------------------------
// Multiplayer Game
// ------------------------------------------------------

socket.on('startGame', (clientGame, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const roomName = 'game_' + clientGame.id
    const game = gameEngine.initGame(clientGame)
    // join the x players to the game room
    for (let i = 0; i < game.players.length; i++) {
        io.sockets.sockets.get(game.players[i].socketId)?.join(roomName)
    }
    // store the game data directly on the room object:
    socket.adapter.rooms.get(roomName).game = game
    // emit the "gameStarted" to all users in the room
    io.to(roomName).emit('gameStarted', game)
    if (callback) {
        callback(game)
    }
})

socket.on('fetchPlayingGames', (callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    if (callback) {
        callback(util.getGamesPlaying(socket))
    }
})

socket.on('play', (playData, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const roomName = 'game_' + playData.gameId
    // load game state from the game data stored directly on the room object:
    const game = socket.adapter.rooms.get(roomName).game
    const playResult = gameEngine.play(game, playData.index, socket.id)
    if (playResult !== true) {
        if (callback) {
            callback(playResult)
        }
        return
    }
    // notify all users playing the game (in the room) that the game state has changed
    // Also, notify them that the game has ended
    io.to(roomName).emit('gameChanged', game)
    if (gameEngine.gameEnded(game)) {
        io.to(roomName).emit('gameEnded', game)
    }
    if (callback) {
        callback(game)
    }
})

socket.on('quitGame', (gameId, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const roomName = 'game_' + gameId
    // load game state from the game data stored directly on the room object:
    const game = socket.adapter.rooms.get(roomName).game
    const quitResult = gameEngine.quit(game, socket.id)
    if (quitResult !== true) {
        if (callback) {
            callback(quitResult)
        }
        return
    }
    // notify all users playing the game (in the room) that the game state has changed
    // Also, notify them that the game has been quit and the game has ended
    io.to(roomName).emit('gameChanged', game)
    io.to(roomName).emit('gameQuitted', { userQuit: socket.data.user, game: game })
    if (gameEngine.gameEnded(game)) {
        io.to(roomName).emit('gameEnded', game)
    }
    socket.leave(roomName)
    if (callback) {
        callback(game)
    }
})

socket.on('closeGame', (gameId, callback) => {
    if (!util.checkAuthenticatedUser(socket, callback)) {
        return
    }
    const roomName = 'game_' + gameId
    // load game state from the game data stored directly on the room object:
    const game = socket.adapter.rooms.get(roomName).game
    const closeResult = gameEngine.close(game, socket.id)
    if (closeResult !== true) {
        if (callback) {
            callback(closeResult)
        }
        return
    }
    socket.leave(roomName)
    if (callback) {
        callback(true)
    }
})

    // sendCardFlipped atualiza o jogo x que a a carta da posição y foi virada
    socket.on('sendCardFlipped', (gameInf, callback) => {
        if (!util.checkAuthenticatedUser(socket, callback)) {
            return
        }
        const roomName = 'game_' + gameInf.gameId
        // load game state from the game data stored directly on the room object:
        const game = socket.adapter.rooms.get(roomName).game
        
        // verifica se a carta já foi virada
        const player = game.players.find(player => player.user.id === gameInf.userid);

        if (game.flippedCards1 != null && game.flippedCards2 != null) {
            game.flippedCards1 = null
            game.flippedCards2 = null
        }
        console.log("\n\ncard1" + game.flippedCards1)
        console.log("\ncard2" + game.flippedCards2)

        if (game.flippedCards1 == null) {
            game.flippedCards1 = gameInf.cardPosition          
        } else {
            game.flippedCards2 = gameInf.cardPosition
            player.plays ++
        }

        console.log("\n\ncard1" + game.flippedCards1)
        console.log("\ncard2" + game.flippedCards2)

        io.to(roomName).emit('gameChanged', game)
        if (callback) {
            callback(game)
        }
    })

})