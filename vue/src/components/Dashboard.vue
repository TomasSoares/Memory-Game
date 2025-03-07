<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const storeAuth = useAuthStore()

const goToNewGame = () => {
  router.push({ name: 'newGame' })
}

const goToGameHistory = () => {
  router.push({ name: 'gameHistory' })
}

const goToScoreboard = () => {
  router.push({ name: 'scoreboard' })
}

const goToNewMultiPlayerGame = () => {
  router.push({ name: 'lobby' })
}

const goToCoins = () => {
  router.push({ name: 'coins' })
}

const goToStatistics = () => {
  router.push({ name: 'statistics' })
}
  
const goToInformationsUser = () => {
  router.push({ name: 'informationsUsers' })
}
</script>

<template>
  <div class="dashboard">
    <h1 class="title">Memory Game</h1>
    <!-- Botões de navegação user Player -->
    <div class="button-container" v-if="storeAuth.user && storeAuth.user.type == 'P'">
      <div class="button-row">
        <button class="dashboard-button" @click="goToNewGame">Single Player</button>
        <button class="dashboard-button" @click="goToNewMultiPlayerGame">MultiPlayer</button>
      </div>
      <div class="button-row">
        <button class="dashboard-button" @click="goToGameHistory">Game History</button>
        <button class="dashboard-button" @click="goToScoreboard">Scoreboard</button>
      </div>
      <div class="button-row">
        <button class="dashboard-button" @click="goToCoins">Coins</button>
        <button class="dashboard-button" @click="goToStatistics">Statistics</button>
      </div>
    </div>

    <!-- Botões de navegação user Admin -->
    <div class="button-container" v-else-if="storeAuth.user && storeAuth.user.type == 'A'">
      <div class="button-row">
        <button class="dashboard-button" @click="goToInformationsUser">Informations users</button>
        <button class="dashboard-button" @click="goToScoreboard">Scoreboard</button>
      </div>
      <div class="button-row">
        <button class="dashboard-button" @click="goToStatistics">Statistics</button>
      </div>
    </div>

    <!-- Botões de navegação user Anónimo -->
    <div class="button-container" v-else>
      <div class="button-row">
        <button class="dashboard-button" @click="goToNewGame">Single Player</button>
        <button class="dashboard-button" @click="goToScoreboard">Scoreboard</button>
      </div>
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

.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  color: #ffffff;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
  margin-bottom: 50px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-row {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.dashboard-button {
  background: linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet);
  background-size: 400% 400%;
  color: #ffffff;
  font-size: 1.3rem;
  padding: 15px 25px;
  border: none;
  border-radius: 50px;
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
</style>