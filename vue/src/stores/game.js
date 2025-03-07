import { ref } from 'vue';
import { defineStore } from "pinia";
import axios from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useToast } from '@/components/ui/toast/use-toast'
import { useCoinsStore } from '@/stores/coins';

// Path: vue/src/stores/game.js
// Single player game store
export const useGameStore = defineStore("game", () => {
  const coinStore = useCoinsStore();
  const authStore = useAuthStore();

  const { toast } = useToast();

  let gameData = ref();
  const cols = ref(0);
  const rows = ref(0);

  const sendGameData = async (timer, counter, board_id) => {
    gameData.value = null;
    try {
      console.log('Timer:', timer);
      console.log('Counter:', counter);
      console.log('Board ID:', board_id);

      // Check if the user is logged in
      if (!authStore.user) {
        return;
      }

      gameData.value = {
        total_time: timer,
        total_turns_winner: counter,
        board_id: board_id,
      };

      // Send POST request to backend
      const response = await axios.post('/game', gameData.value);
      const { beat_personal_best, beat_global_top3 } = response.data;
      console.log('Game data saved:', response.data);

      let toastMessage = null;

      // Build a consolidated toast message
      if (beat_personal_best && beat_global_top3) {
        toastMessage = "You beat your personal best and made it to Global Top 3! 🎉 +2 coins!";
      } else if (beat_personal_best) {
        toastMessage = "You beat your personal best! 🎉 +1 coin!";
      } else if (beat_global_top3) {
        toastMessage = "Global Top 3! 🎉 +1 coin!";
      }
      else {
        toastMessage = "Game completed! No records beaten this time. Try again!";
      }

      // Show toast if there's a message
      if (toastMessage) {
        setTimeout(() => {
          toast({
            description: toastMessage,
            className: beat_personal_best || beat_global_top3 ? "toast-success" : "toast-info",
          });
        }, 1000);

        if (beat_personal_best || beat_global_top3) {
          coinStore.getCoins();
        }
      }

    } catch (error) {
      console.error('Error sending game data:', error.response?.data || error.message);
      setTimeout(() => {
        toast({
          description: "Failed to save game data. Please try again.",
          className: "toast-error",
        });
      }, 1000);
    }
  };

  const getBoard = async (boardId) => {
    try {
      const response = await axios.post('/board', { id: boardId });
      cols.value = response.data.board_cols;
      rows.value = response.data.board_rows;
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };


  return {
    sendGameData,
    getBoard,
    cols,
    rows,
  };
});

// Path: vue/src/stores/gameMultiplayer.js
// Multiplayer game store
