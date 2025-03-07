<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCoinsStore } from '@/stores/coins'
  import { useBoardStore } from '@/stores/board'

  const router = useRouter();
  const storeCoins = useCoinsStore();
  const storeBoard = useBoardStore();
  
  storeBoard.fetchBoards();

  // State
  const isOpen = ref(false); // Dropdown open/close state
  const selectedBoard = ref(null); // Selected board object


  // Dropdown methods
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const selectBoard = (board) => {
    selectedBoard.value = board;
    isOpen.value = false;
  };

  // Start game method
  const startGame = () => {
    if (selectedBoard.value) {

      if (!selectedBoard.value) return;
      
      if (selectedBoard.value.id != 1) {
        if (storeCoins.gameCoins < 1) {

          alert('Insufficient coins to start this game.');
          return;
        }

        storeCoins.spendCoins(1);
      }

      router.push({
        name: 'game',
        query: {
          boardId: selectedBoard.value.id,
        },
      });
    }
  };

</script>


<template>
  <div class="game-new-container">
    <h1 class="title">New Singleplayer Game</h1>

    <!-- Dropdown Label -->
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

    <!-- Start Game Button -->
    <div class="start-game-container">
      <button class="start-game-button" :disabled="!selectedBoard" @click="startGame">
        Start Game
      </button>
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
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329); /* Same as dashboard background */
  color: #ffffff;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
  margin-bottom: 50px;
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

/* Start Game Button */
.start-game-container {
  margin-top: 20px;
}

.start-game-button {
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

.start-game-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.start-game-button:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0px 8px 14px rgba(0, 0, 0, 0.6);
  text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.7);
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
