<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useGameStore } from '@/stores/game';

const route = useRoute();

const gameStore = useGameStore();

const lockBoard = ref(false);
const lockDuration = 250;

const boardId = parseInt(route.query.boardId);

const cards = ref([]);
const cardsChosen = ref([]);
const cardsChosenId = ref([]);
const cardsWon = ref([]);

const resultMessage = ref('0');
const counter = ref(0);

const gameStarted = ref(false);
const gameFinished = ref(false);

const timer = ref(0);
const timerInterval = ref(null);

const hidden = new URL('@/assets/img/icon/hidden.png', import.meta.url).href;

// Sounds
const flipSound = new Audio(new URL('@/assets/sounds/flip-card-sound.mp3', import.meta.url).href);
const matchSound = new Audio(new URL('@/assets/sounds/match-sound.mp3', import.meta.url).href);
const winSound = new Audio(new URL('@/assets/sounds/victory-sound.mp3', import.meta.url).href);

// Function to play a sound
const playSound = (sound) => {
  sound.currentTime = 0; 
  sound.play();
};

// Initialize cards
const initialCards = ref([
  // Populate with card details as in your existing setup
  { name: '0', img: new URL('@/assets/img/icon/0.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '1', img: new URL('@/assets/img/icon/1.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '2', img: new URL('@/assets/img/icon/2.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '3', img: new URL('@/assets/img/icon/3.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '4', img: new URL('@/assets/img/icon/4.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '5', img: new URL('@/assets/img/icon/5.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '6', img: new URL('@/assets/img/icon/6.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '7', img: new URL('@/assets/img/icon/7.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '8', img: new URL('@/assets/img/icon/8.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '9', img: new URL('@/assets/img/icon/9.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '10', img: new URL('@/assets/img/icon/10.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '11', img: new URL('@/assets/img/icon/11.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '12', img: new URL('@/assets/img/icon/12.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '13', img: new URL('@/assets/img/icon/13.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '14', img: new URL('@/assets/img/icon/14.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '15', img: new URL('@/assets/img/icon/15.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '16', img: new URL('@/assets/img/icon/16.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '17', img: new URL('@/assets/img/icon/17.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '18', img: new URL('@/assets/img/icon/18.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '19', img: new URL('@/assets/img/icon/19.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '20', img: new URL('@/assets/img/icon/20.png', import.meta.url).href, isFlipped: false, isMatched: false },
]);

const buttonContainerStyle = computed(() => {
  if (gameStore.cols === 3 && gameStore.rows === 4) {
    return { paddingTop: '120px' };
  }
  return { paddingTop: '30px' };
});

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

// Generate the cards based on board dimensions
const generateCards = () => {
  const totalCards = gameStore.cols * gameStore.rows;
  const requiredPairs = Math.floor(totalCards / 2);

  if (requiredPairs > initialCards.value.length) {
    console.error("Not enough unique cards to generate the board!");
    return;
  }

  const shuffledInitialCards = [...initialCards.value].sort(() => Math.random() - 0.5);
  const cardsToUse = shuffledInitialCards.slice(0, requiredPairs);
  cards.value = [...cardsToUse, ...cardsToUse.map(card => ({ ...card }))].sort(() => Math.random() - 0.5);
};


// Card flip logic
const flipCard = (index) => {
  if (lockBoard.value) return;

  const card = cards.value[index];
  if (card.isFlipped || card.isMatched) return;

  if (!gameStarted.value) {
    gameStarted.value = true;
    startTimer();
  }

  playSound(flipSound);
  card.isFlipped = true;
  cardsChosen.value.push(card.name);
  cardsChosenId.value.push(index);

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
    playSound(matchSound); 
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
    gameStore.sendGameData(timer.value, counter.value, boardId);
    gameFinished.value = true;
    playSound(winSound); 
  } else {
    resultMessage.value = cardsWon.value.length;
  }
};

onMounted(async () => {
  try {
    await gameStore.getBoard(boardId);
    generateCards();
  } catch (error) {
    console.error('Failed to initialize board:', error);
  }
});

const playAgain = () => {
  cards.value.forEach(card => {
    card.isFlipped = false;
    card.isMatched = false;
  });

  cards.value = [];
  cardsChosen.value = [];
  cardsChosenId.value = [];
  cardsWon.value = [];
  resultMessage.value = '0';
  counter.value = 0;
  timer.value = 0;
  gameFinished.value = false;
  gameStarted.value = false;

  generateCards();
};

const goToHome = () => {
  window.location.href = '/';
};

</script>

<template>
  <div class="game-new-container">
    <p class="game-message">Founded pairs: <span>{{ resultMessage }}</span></p>
    <p class="game-message">Number of plays: <span>{{ counter }}</span></p>
    <p class="game-message">Time: <span>{{ timer }}</span>s</p>

    <div class="board"
      :style="`grid-template-columns: repeat(${gameStore.cols}, 1fr); grid-template-rows: repeat(${gameStore.rows}, auto);`">
      <div v-for="(card, index) in cards" :key="index" class="card">
        <img :src="card.isFlipped || card.isMatched ? card.img : hidden" @click="flipCard(index)" />
      </div>
    </div>

    <div v-if="gameFinished" class="button-container" :style="buttonContainerStyle">
      <button class="dashboard-button" @click="playAgain">Play Again</button>
      <button class="dashboard-button" @click="goToHome">Back to Home</button>
    </div>
  </div>
</template>

<style scoped>
html,
body {
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
  cursor: url('/cursor.cur'), auto;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
  margin-bottom: 20px;
}

.button-container {
  padding-top: 70px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.dashboard-button {
  background: linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet);
  background-size: 200% 200%;
  color: #ffffff;
  font-size: 1.1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.5);
  animation: gradientAnimation 6s infinite;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.dashboard-button:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 14px rgba(0, 0, 0, 0.6);
  text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.7);
}

.dashboard-button:active {
  transform: translateY(2px);
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
  margin-top: 10px;
  display: grid;
  gap: 5px;
  width: 100%;
  max-width: 300px;
  height: 300px;
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
