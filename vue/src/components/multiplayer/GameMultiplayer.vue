<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useGameMultiplayerStore } from '@/stores/gameMultiplayer';
  import { useAuthStore } from '@/stores/auth';

  const storeGameMultiplayer = useGameMultiplayerStore();
  const storeAuth = useAuthStore();

  const player = ref();

  watch(() => storeGameMultiplayer.game, (game) => {
    if (game) {
      player.value = game.players.find(player => player.user.id === storeAuth.user.id);
        if (game.flippedCards1 != null) {
          flipCard(game.flippedCards1, false);
        } else {
          console.log("flippedCards2: " + game.flippedCards2);  
          flipCard(game.flippedCards2, false);
        }
        if (game.matchedPairs != null){
          for (let index = 0; index < game.matchedPairs.length; index++) {
            const pair = game.matchedPairs[index];
            cards.value[pair[0]].isMatched = true;
            cards.value[pair[1]].isMatched = true;
          }
        }

    }
  });

  const lockBoard = ref(false);
  const lockDuration = 250;
  
  const cards = ref([]);
  const cardsChosen = ref([]);
  const cardsChosenId = ref([]);
  const cardsWon = ref([]);

  const resultMessage = ref('0');
  const counter = ref(0);
  
  const gameStarted = ref(false);
  
  const timer = ref(0);
  const timerInterval = ref(null);
  
  const cols = storeGameMultiplayer.game.board.board_cols;
  const rows = storeGameMultiplayer.game.board.board_rows; 
  
  const hidden = new URL('@/assets/img/icon/hidden.png', import.meta.url).href;

  const generateCards = () => {
    const positions = storeGameMultiplayer.game.positionsCards; 

    for (let index = 0; index < positions.length; index++) {
      const position = positions[index];
      cards.value.push({
        id: index,
        position: position,
        name: position, // Referencia as imagens pelas posições
        img: new URL(`../../assets/img/icon/${position}.png`, import.meta.url).href,
        isFlipped: false,
        isMatched: false,
      });
    }
  };

  // Iniciar o timer
  const startTimer = () => {
    timer.value = 0; // Reinicia o timer
    timerInterval.value = setInterval(() => {
      timer.value++;
    }, 1000); // Incrementa a cada segundo
  };

  // Parar o timer
  const stopTimer = () => {
    clearInterval(timerInterval.value);
  };

  // Card flip logic
  const flipCard = (index, bool) => {
    if (lockBoard.value) return;

    const card = cards.value[index];
    if (card.isFlipped || card.isMatched) return;

    if (!gameStarted.value) {
      gameStarted.value = true;
      startTimer();
    }
    storeGameMultiplayer.sendCardFlipped(index);

    card.isFlipped = true;
    cardsChosen.value.push(card.name);
    cardsChosenId.value.push(index);
    console.log("tou aqui ::: scard" + cardsChosenId.value.length);
    if (cardsChosen.value.length === 2) {
      lockBoard.value = true; 
      setTimeout(checkForMatch, 500);
      counter.value++;
    }
  };

  // Check for a match
  const checkForMatch = () => {
    const [optionOneId, optionTwoId] = cardsChosenId.value;
    const [optionOneName, optionTwoName] = cardsChosen.value;

    if (optionOneName === optionTwoName) {
      cards.value[optionOneId].isMatched = true;
      cards.value[optionTwoId].isMatched = true;
      cardsWon.value.push(cardsChosen.value);

      lockBoard.value = false;
    } else {
      setTimeout(() => {
        cards.value[optionOneId].isFlipped = false;
        cards.value[optionTwoId].isFlipped = false;
        lockBoard.value = false;
      }, lockDuration);
    }

    cardsChosen.value = [];
    cardsChosenId.value = [];
    updateResultMessage();
  };


  const updateResultMessage = () => {
    if (cardsWon.value.length === cards.value.length / 2) {
      resultMessage.value = 'Congratulations! You found all the pairs!';
      stopTimer();
      //gameStore.sendGameData(timer.value, counter.value, boardId);
    } else {
      resultMessage.value = cardsWon.value.length;
    }
  };

  onMounted( async () => {
    generateCards();
  });
</script>

<template>
  <div class="game-new-container">
    <p class="game-message">Pares encontrados: <span>{{ player?.pairsFound?.length ?? 0 }}</span></p>
    <p class="game-message">Número de jogadas: <span>{{ player?.plays ?? 0 }}</span></p>
    <p class="game-message">Tempo decorrido: <span>{{ player?.time ?? 0  }}</span>s</p>

    <div class="board"
      :style="`grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, auto);`">
      <div v-for="(card, index) in cards" :key="index" class="card">
        <img :src="card.isFlipped || card.isMatched ? card.img : hidden" @click="flipCard(index, true)" />
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

  .game-new-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #000000, #1C1C1C);
    color: #ffffff;
    box-sizing: border-box;
    overflow: hidden;
  }

  .title {
    font-size: 3.5rem;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
    margin-bottom: 20px;
  }

  .game-message {
    font-size: 1.4rem;
    font-weight: 500;
    color: #ffffff;
    margin: 5px 0;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
    transition: color 0.3s ease;
  }

  .game-message span {
    font-size: 1.6rem;
    font-weight: bold;
    color: #ffdc5c;
  }

  .game-message:hover {
    color: #ffdc5c;
  }

  .board {
    margin-top: 20px;
    display: grid;
    gap: 8px;
    width: 100%;
    max-width: 400px;
    height: 400px;
  }

  .card img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .card img:hover {
    transform: scale(1.05);
  }
</style>
