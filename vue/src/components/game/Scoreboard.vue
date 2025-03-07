<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth'

  const storeAuth = useAuthStore();

  // Personal Scoreboard Data
  const personalScores = ref([]);

  // Global Scoreboard Data
  const globalScores3by4 = ref([]);
  const globalScores4by4 = ref([]);
  const globalScores6by6 = ref([]);

  // Fetch Personal Scoreboard Data
  const fetchPersonalScores = async () => {
    if(storeAuth.user && storeAuth.user.type == 'P') {
    try {
      const response = await axios.get('/scoreboard/personal', {id: storeAuth.user.id});
      console.log("Personal Scores:", response.data);
      personalScores.value = response.data;
    } catch (error) {
      console.error("Error fetching Personal Scoreboard data", error);
    }
  }
  };

  // Fetch Global Scoreboard Data
  const fetchGlobalScores3by4 = async () => {
    try {
      const response = await axios.get('/scoreboard/global3por4');
      globalScores3by4.value = response.data;     
    } catch (error) {
      console.error("Error fetching Global Scoreboard data", error);
    }
  };

  const fetchGlobalScores4by4 = async () => {
    try {
      const response = await axios.get('/scoreboard/global4por4');
      globalScores4by4.value = response.data;
      console.log("Global Scores 4 by 4:", response.data);
    } catch (error) {
      console.error("Error fetching Global Scoreboard data", error);
    }
  };

  const fetchGlobalScores6by6 = async () => {
    try {
      const response = await axios.get('/scoreboard/global6por6');
      globalScores6by6.value = response.data;
    } catch (error) {
      console.error("Error fetching Global Scoreboard data", error);
    }
  };

  // Function to determine the medal background color based on the rank
  const getMedalStyle = (index) => {
    if (index === 0) {
      return { backgroundColor: 'gold', color: 'white' };
    } else if (index === 1) {
      return { backgroundColor: 'silver', color: 'white' };
    } else if (index === 2) {
      return { backgroundColor: '#cd7f32', color: 'white' };
    }
    return { color: 'white' };
  };

  // Load data on component mount
  onMounted(() => {
    fetchPersonalScores();
    fetchGlobalScores3by4();
    fetchGlobalScores4by4();
    fetchGlobalScores6by6();
  });
  
</script>


<template>
  <div class="scoreboard-container">

    <br>
    <!-- <h1>Scoreboard</h1> -->

    <!-- Personal Scoreboard -->
    <div v-if="storeAuth.user && storeAuth.user.type == 'P'" class="personal-scoreboard">
      <h2>My Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Board Size</th>
            <th>Shortest Time</th>
            <th>Fewest Turns</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="personalScores.length === 0">
            <td colspan="4" class="no-data">No personal scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in personalScores" :key="score.boardSize">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.boardSize }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr v-if="storeAuth.user && storeAuth.user.type == 'P'" />

    <!-- Global Scoreboard 3x4 -->
    <div class="global-scoreboard">
      <h2>Global Leaderboard 3x4</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Best Time</th>
            <th>Fewest Turns</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="globalScores3by4.length === 0">
            <td colspan="5" class="no-data">No global scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in globalScores3by4" :key="score.boardSize + score.player">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <!-- Global Scoreboard 4x4 -->
    <div class="global-scoreboard">
      <h2>Global Leaderboard 4x4</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Best Time</th>
            <th>Fewest Turns</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="globalScores4by4.length === 0">
            <td colspan="5" class="no-data">No global scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in globalScores4by4" :key="score.boardSize + score.player">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <!-- Global Scoreboard 6x6 -->
    <div class="global-scoreboard">
      <h2>Global Leaderboard 6x6</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Best Time</th>
            <th>Fewest Turns</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="globalScores6by6.length === 0">
            <td colspan="5" class="no-data">No global scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in globalScores6by6" :key="score.boardSize + score.player">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  
</template>


<style scoped>
.scoreboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  color: #ffffff;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
  margin-bottom: 30px;
  text-align: center; /* Center the title */
}

h2 {
  font-size: 2.5rem; /* Increased font size */
  font-weight: 600; /* Slightly bolder */
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.6); /* Subtle shadow to enhance visibility */
  letter-spacing: 1px; /* Slight letter spacing for better readability */
  text-align: center; /* Center the title */
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

th, td {
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

.no-data {
  text-align: center;
  color: #bbbbbb;
  font-style: italic;
}

hr {
  margin: 40px 0;
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  width: 90%;
}

.personal-scoreboard,
.global-scoreboard {
  width: 100%;
  margin-bottom: 40px;
}

td[style] {
  color: #ffcc00;
  font-weight: bold;
}
</style>
