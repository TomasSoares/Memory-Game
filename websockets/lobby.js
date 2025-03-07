exports.createLobby = () => {
    const games = new Map()

    const addGame = (user, board, gameAPI, socketId) => {
        if (getGames().find(game => game.players[0].user.id == user.id)) {
            return "You already have a lobby"
        }
        const game = {
            id: gameAPI.id,
            type: gameAPI.type,
            status: gameAPI.status,
            created_at: Date.now(),
            players: [{
                user: user,
                socketId: socketId,
                pairsFound: [],
                plays: 0,
                time: null
            }],
            board: board,
        }

        games.set(gameAPI.id, game)
        return game
    }

    const removeGame = (id) => {
        games.delete(id)
        return games
    }

    const removePlayer = (gameid, userid) => {
        const game = getGame(gameid) 
        game.players = game.players.filter(player => player.user.id != userid)
        return game
    }

    const existsGame = (id) => {
        return games.has(id)
    }

    const getGame = (id) => {
        return games.get(id)
    }

    const getGames = () => {
        return [...games.values()]
    }

    const leaveLobby = (socketId) => {
        const gamesToDelete = [...games.values()].filter(game => game.player1SocketId == socketId)
        gamesToDelete.forEach(game => {
            games.delete(game.id)
        })
        return getGames()
    }

    return {
        getGames,
        getGame,
        addGame,
        removeGame,
        removePlayer,
        existsGame,
        leaveLobby
    }
}