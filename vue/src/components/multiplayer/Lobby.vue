<script setup>
    import { ref, onMounted, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import ListGamesLobby from './ListGamesLobby.vue'
    import { useLobbyStore } from '@/stores/lobby'
    import { useBoardStore } from '@/stores/board'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const storeLobby = useLobbyStore()
    const storeBoard = useBoardStore();
    const storeAuth = useAuthStore();

    storeBoard.fetchBoards();

    const selectedBoard = ref(null);
    const isOpen = ref(false);

    const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
    };

    const selectBoard = (board) => {
        selectedBoard.value = board;
        isOpen.value = false;
    };

    const addGame = (board) => {
        storeLobby.addGame(board);
    };

    watch(() => storeLobby.game, (myGame) => {
        mylobby(myGame);
    });
    
    const mylobby = (myGame) => {
        if (myGame.players[0].user.id === storeAuth.user.id) {
            router.push({ name: 'mylobby' })
        }
    }

    onMounted(() => {
        storeLobby.fetchGames()
    })
</script>

<template>
    <div class="lobby-container">
        <div class="lobby-card">
            <div class="lobby-header">
                <h1 class="lobby-title">Lobby</h1>
                <p class="lobby-description">
                    {{ storeLobby.totalGames === 1 ? '1 game' : storeLobby.totalGames + ' games' }} waiting.
                </p>
            </div>
            <div class="lobby-content">
                <div class="dropdown">
                    <div class="dropdown-label" @click="toggleDropdown">
                        {{ selectedBoard ? `Board ${selectedBoard.board_cols}x${selectedBoard.board_rows}` : 'Select a Board' }}
                        <span class="dropdown-arrow">&#9660;</span>
                    </div>
                    <div v-if="isOpen" class="dropdown-menu show">
                        <!-- Dynamic List of Boards -->
                        <button v-for="board in storeBoard.boards" :key="board.id" class="dropdown-item" @click="selectBoard(board)">
                        Board {{ board.board_cols }}x{{ board.board_rows }}
                        </button>
                    </div>
                </div>
                <button class="lobby-button" v-if="selectedBoard" :disabled="!selectedBoard"  @click="addGame(selectedBoard)">
                    New Game
                </button>
                <div v-if="storeLobby.totalGames > 0">
                    <ListGamesLobby></ListGamesLobby>
                </div>
                <div v-else>
                    <p class="empty-message">The lobby is empty!</p>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: 'Poppins', sans-serif;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .lobby-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
        color: #ffffff;
    }

    .lobby-card {
        background: linear-gradient(135deg, #1e1e2f, #2d2d44);
        border-radius: 20px;
        box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.5);
        padding: 20px;
        width: 90%;
        max-width: 600px;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

    .lobby-card:hover {
        transform: translateY(-5px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.7);
    }

    .lobby-header {
        text-align: center;
        margin-bottom: 15px;
    }

    .lobby-title {
        font-size: 2.5rem;
        font-weight: bold;
        text-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
    }

    .lobby-description {
        font-size: 1.2rem;
        color: #d4d4d8;
    }

    .lobby-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    .lobby-button {
        background: linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet);
        background-size: 400% 400%;
        color: #ffffff;
        font-size: 1.3rem;
        padding: 15px 25px;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.5);
        animation: gradientAnimation 6s infinite;
        text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
    }

    .lobby-button:hover {
        transform: translateY(-5px);
        box-shadow: 0px 8px 14px rgba(0, 0, 0, 0.6);
        text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.7);
    }

    .lobby-button:active {
        transform: translateY(2px);
    }

    .empty-message {
        font-size: 1.5rem;
        color: #ff758f;
        text-align: center;
    }

    /* Dropdown styles */
    .dropdown {
        position: relative;
        display: inline-block;
        margin-top: 20px;
    }

    .dropdown-label {
        background-color: #1f1f1f;
        color: #ffffff;
        font-size: 1.3rem;
        padding: 15px 30px;
        /* Adjust padding for more width */
        border-radius: 50px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 250px;
        /* Set a specific width for the dropdown label */
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.5);
    }

    .dropdown-label:hover {
        background-color: #333;
        transform: translateY(-5px);
    }

    .dropdown-arrow {
        font-size: 1.5rem;
        margin-left: 10px;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #1f1f1f;
        border: 1px solid #444;
        border-radius: 8px;
        box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: opacity 0.3s ease, visibility 0s 0.3s, transform 0.3s ease;
    }

    .dropdown-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        transition: opacity 0.3s ease, visibility 0s 0s, transform 0.3s ease;
    }

    .dropdown-item {
        background: none;
        border: none;
        padding: 15px 25px;
        text-align: left;
        width: 100%;
        cursor: pointer;
        font-size: 1.2rem;
        color: #ffffff;
        transition: background-color 0.3s ease, color 0.3s ease;
        border-radius: 5px;
    }

    .dropdown-item:hover {
        background-color: #444444;
        color: #ffdc5c;
    }

    .dropdown-item:focus {
        outline: none;
        background-color: #3b3b3b;
        color: #ffdc5c;
    }

    @keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
    }
</style>