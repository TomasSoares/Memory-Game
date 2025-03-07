exports.createGameEngine = () => {

    const initGame = (gameFromDB) => {
        gameFromDB.gameStatus = null
        gameFromDB.currentPlayer = 1
        gameFromDB.flippedCards1 = null
        gameFromDB.flippedCards2 = null
        gameFromDB.cardsFound = []
        gameFromDB.matchedPairs = []
        gameFromDB.cards = chooseCards(gameFromDB.board)
        gameFromDB.positionsCards = shuffleArray(gameFromDB.cards)
        return gameFromDB
    }

    const chooseCards = (board) => {
        const cards = []
        const numberOfCards = board.board_cols * board.board_rows / 2
        for (let i = 0; i < numberOfCards; i++) {
            let card = Math.floor(Math.random() * 20)
            while (cards.includes(card)) {
                card = Math.floor(Math.random() * 20)
            }
            cards.push(card)
        }
        return cards
    }

    const generateBoard = () => {
        const pairs = 6 // Number of pairs for a 3x4 board
        const board = []
        for (let i = 1; i <= pairs; i++) {
            board.push(i, i)
        }
        return board
    }

    const shuffleArray = (array) => {
        return array.concat(array).sort(() => Math.random() - 0.5)
    }

    const changeGameStatus = (game) => {
        if (game.matchedPairs === game.board.length / 2) {
            game.gameStatus = game.player1Score > game.player2Score ? 1 : 2
        } else {
            game.gameStatus = 0
        }
    }

    const gameEnded = (game) => game.gameStatus > 0

    const play = (game, index, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) &&
            (playerSocketId != game.player2SocketId)) {
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            }
        }
        if (((game.currentPlayer == 1) && (playerSocketId != game.player1SocketId))
            ||
            ((game.currentPlayer == 2) && (playerSocketId != game.player2SocketId))) {
            return {
                errorCode: 12,
                errorMessage: 'Invalid play: It is not your turn!'
            }
        }
        if (game.flippedCards.length === 2) {
            return {
                errorCode: 13,
                errorMessage: 'Invalid play: Two cards are already flipped!'
            }
        }
        if (game.board[index] === null) {
            return {
                errorCode: 14,
                errorMessage: 'Invalid play: Card already matched!'
            }
        }
        game.flippedCards.push(index)
        if (game.flippedCards.length === 2) {
            const [firstIndex, secondIndex] = game.flippedCards
            if (game.board[firstIndex] === game.board[secondIndex]) {
                game.board[firstIndex] = null
                game.board[secondIndex] = null
                game.matchedPairs++
                if (game.currentPlayer === 1) {
                    game.player1Score = (game.player1Score || 0) + 1
                } else {
                    game.player2Score = (game.player2Score || 0) + 1
                }
            } else {
                game.currentPlayer = game.currentPlayer === 1 ? 2 : 1
            }
            game.flippedCards = []
            changeGameStatus(game)
        }
        return true
    }

    const quit = (game, playerSocketId) => {
        if ((playerSocketId != game.players[0].socketId) &&
            (playerSocketId != game.players[1].socketId)) {
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            }
        }
        game.gameStatus = playerSocketId == game.players[0].socketId ? 2 : 1
        game.status = 'ended'
        return true
    }

    const close = (game, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId !=
            game.players[1].socketId)) {
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (!gameEnded(game)) {
            return {
                errorCode: 14,
                errorMessage: 'Cannot close a game that has not ended!'
            }
        }
        return true
    }

    return {
        initGame, 
        play, 
        quit, 
        close, 
        gameEnded, 
        generateBoard, 
        shuffleArray
    }
}