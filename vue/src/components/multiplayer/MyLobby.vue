<script setup>
    import { onMounted, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { useLobbyStore } from '@/stores/lobby'
    import { useBoardStore } from '@/stores/board'
    import { useAuthStore } from '@/stores/auth'
    import { useGameMultiplayerStore } from '@/stores/gameMultiplayer'
    import { useToast } from "@/components/ui/toast/use-toast";

    const storeLobby = useLobbyStore()
    const storeBoard = useBoardStore();
    const storeAuth = useAuthStore();
    const storeGameMultiplayer = useGameMultiplayerStore();

    const router = useRouter()
    const { toast } = useToast();

    storeBoard.fetchBoards();

    watch(() => storeLobby.game.players, (myGame) => {
        // percorre todos os jogadores do jogo se não tiver na lista volta a tela de lobby
        if (myGame.length > 0 && !myGame.find(player => player.user.id === storeAuth.user.id)) {
            toast({
                title: "Voce foi removido do jogo",
                description: "O lider do jogo removeu te da sala",
                variant: 'destructive'
            })
            router.push({ name: 'lobby' })
        }
    });

    watch(() => storeLobby.game.cards, (myGame) => {
        myGame = storeLobby.game;
        const numCardneeded = myGame.board.board_rows * myGame.board.board_cols;
        if (myGame.players.length >= 2 && myGame.cards.length == numCardneeded / 2 && myGame.positionsCards.length == numCardneeded) {
            router.push({ name: 'gameMultiplayer' })
        }
    });

    onMounted(() => {
        storeLobby.fetchGames()
    })
</script>

<template>
    <div class="lobby-container">
        <div class="lobby-card">
            <div class="lobby-header">
                <h1 class="lobby-title">{{ storeLobby.game.players[0].user.nickname }}'s Lobby</h1>
                <p class="lobby-description">
                    {{ storeLobby.game.players.length === 1 ? storeLobby.game.players.length + " player" : storeLobby.game.players.length + " players"  }}  
                </p>
                <p class="lobby-description">
                    waiting for more  players...
                </p>
            </div>
            <div class="lobby-content">
                <button class="lobby-button" v-if="storeLobby.game.players.length > 1 && storeLobby.game.players[0].user.id == storeAuth.user.id"  @click="storeLobby.startedGame()">
                    Start Game
                </button>
                <div v-if="storeLobby.game.players.length > 0">
                    <div class="divide-y divide-solid divide-gray-200">
                        <div v-for="(user, index) in storeLobby.game.players" :key="user.user.id" class="flex ps-2 pe-1">
                            <div class="flex flex-col grow">
                                <div class="text-base pe-4 grow leading-7 flex space-x-2">
                                    <span class="pl-1">{{ user.user.nickname }}</span>
                                </div>
                            </div>
                            <div class="py-1 flex items-center min-w-[1.9rem]">
                                <button v-show="index !== 0 && storeLobby.game.players[0].user.id == storeAuth.user.id" type="button"
                                    class="inline-block rounded bg-red-500 p-2 m-0.5 text-white"
                                    @click="storeLobby.removePlayer(storeLobby.game.id, user.user.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                        stroke="currentColor" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
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