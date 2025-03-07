import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useGameMultiplayerStore } from '@/stores/gameMultiplayer'
import { useToast } from '@/components/ui/toast/use-toast'


export const useLobbyStore = defineStore('lobby', () => {
    const { toast } = useToast()

    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const storeGameMultiplayer = useGameMultiplayerStore()
    
    const socket = inject('socket')

    const games = ref([])
    const game = ref()

    const totalGames = computed(() => games.value.length)

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    // when the lobby changes on the server, it is updated on the client
    socket.on('lobbyChanged', (lobbyGames) => {
        games.value = lobbyGames
    })

    socket.on('lobbyPlayerGameChange', (lobbyPlayerGameChange) => {
        game.value = lobbyPlayerGameChange
    })

    socket.on('gameStarted', (gameStarted) => {
        game.value = gameStarted
        storeGameMultiplayer.game = gameStarted
    })
    
    // fetch lobby games from the Websocket server
    const fetchGames = () => {
        storeError.resetMessages()
        socket.emit('fetchGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }
    
    // add a game to the lobby
    const addGame = async(board) => {
        storeError.resetMessages()
        const response = await axios.post('/multiplayer/gameCreate', {
            board_id: board.id
        })
        socket.emit('addGame', board, response.data.game, (response) => {
            if (response === 'You already have a lobby') {
                toast({
                    title: 'Error',
                    description: response,
                    variant: 'destructive'
                })
                return
            }
            if (webSocketServerResponseHasError(response)) {
                return
            }
            
            game.value = response
        })
    }

    // remove a game from the lobby
    const removeGame = (id) => {
        storeError.resetMessages()
        socket.emit('removeGame', id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    const removePlayer = (gameid, userid) => {
        storeError.resetMessages()
        socket.emit('removePlayer', gameid, userid, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // join a game of the lobby
    const joinGame = (game) => {
        storeError.resetMessages()
        socket.emit('joinGame', game.id, async (response) => {
            //console.log('joinGame response', response)
            game.value = response
            // callback executed after the join is complete
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    const startedGame = async() => {
        await axios.post('/multiplayer/gameStart', {
            game_id: game.value.id
        })
        game.value.status = 'PL';
        socket.emit('startGame', game.value, (startedGame) => {
            //console.log('Game has started', startedGame)
        })
    }

    // Whether the current user can remove a specific game from the lobby
    const canRemoveGame = async (game) => {
        return storeAuth.user && game.players[0].user.id === storeAuth.user.id
    }

    // Whether the current user can join a specific game from the lobby
    const canJoinGame = (game) => {
        return storeAuth.user && game.players[0].user.id !== storeAuth.user.id
    }

    return {
        game,
        games,
        totalGames, 
        fetchGames,
        addGame,
        joinGame,
        startedGame,
        canJoinGame,
        removeGame,
        removePlayer,
        canRemoveGame,

    }
})