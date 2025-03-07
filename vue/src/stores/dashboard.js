import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    isLoggedIn: false,
    gameCoins: 0,
    gameHistory: [],
    scoreboard: []
  }),
  actions: {
    setLoginStatus(status) {
      this.isLoggedIn = status
    },
    setGameCoins(coins) {
      this.gameCoins = coins
    },
    setGameHistory(history) {
      this.gameHistory = history
    },
    setScoreboard(scores) {
      this.scoreboard = scores
    },

    // Ação para buscar o histórico do jogo
    async fetchGameHistory() {
      try {
        const response = await axios.get('/game/history'); // Ajuste a URL conforme sua API
        this.setGameHistory(response.data); // Atualize o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar histórico do jogo:', error);
      }
    },
    /*

    Classificação do jogo
    async fetchScoreboard() {
      try {
        const response = await axios.get('/game/scoreboard'); // Ajuste a URL conforme sua API
        this.setScoreboard(response.data); // Atualize o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar a classificação:', error);
      }
    },

     Atualizar número de moedas do jogo
    async fetchGameCoins() {
      try {
        const response = await axios.get('/game/coins'); // Ajuste a URL conforme sua API
        this.setGameCoins(response.data.coins); // Atualize o estado com as moedas recebidas
      } catch (error) {
        console.error('Erro ao buscar moedas do jogo:', error);
      }
    }

    */
  }
})
