<script setup>
  import { ref } from 'vue';
  import axios from 'axios';

  const games = ref([]);
  const currentPage = ref(1);
  const lastPage = ref(1);

  const fetchGames = async (page = 1) => {
    if (page < 1 || page > lastPage.value) return;

    try {
      const response = await axios.get(`/game/gamehistory?page=${page}`);
      console.log(response.data);
      games.value = response.data.data;
      currentPage.value = response.data.current_page;
      lastPage.value = response.data.last_page;
    } catch (error) {
      console.error("Error on fetching game history", error);
    }
  };

  fetchGames();
  
</script>

<template>
  <div class="game-history-container">
    <br>
    <h1>Game History</h1>
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Number of turns</th>
          <th>Board</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>{{ game.status }}</td>
          <td>{{ game.num_turns }}</td>
          <td>{{ game.board }}</td>
          <td>{{ game.created_at }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-controls">
      <button class="gameHistory-button" @click="fetchGames(currentPage - 1)" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ lastPage }}</span>
      <button class="gameHistory-button" @click="fetchGames(currentPage + 1)" :disabled="currentPage === lastPage">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
}

.game-history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  overflow: hidden;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
  margin-bottom: 30px;
  text-align: center;
}

table {
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

th,
td {
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

th {
  background: linear-gradient(135deg, #2a2a60, #3b3b82);
  text-transform: uppercase;
  font-weight: bold;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.gameHistory-button {
  background-color: #2a2a60;
  color: #ffffff;
  font-size: 1rem;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.gameHistory-button:hover {
  background-color: #253544;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.gameHistory-button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

span {
  font-size: 1.2rem;
  color: #ffffff;
}
</style>