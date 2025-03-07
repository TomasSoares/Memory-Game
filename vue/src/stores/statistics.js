import { ref } from 'vue'
import { defineStore } from "pinia";
import axios from "axios";
import { get } from '@vueuse/core';

export const useStatisticsStore = defineStore("statistics", () => {

  const generalStats = ref(null);
  const adminStats = ref(null);
  const gamesPerMonth = ref(null);
  const popularPurchaseMethod = ref([]);
  const boardData = ref([]);
  const coinsPerMonth = ref([]);

  const getGeneralStatistics = async () => {
    try {
      const response = await axios.get('statistics/general');
      generalStats.value = response.data;

    } catch (error) {
      console.error('Error fetching general statistics:', error);
    }
  };

  const getAdminStatistics = async () => {
    try {
      const response = await axios.get('statistics/admin');
      adminStats.value = response.data;
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
    }
  };

  const getGamesPerMonth = async () => {
    try {
      const response = await axios.get('statistics/viewGamesPerMonth');
      gamesPerMonth.value = response.data.games_by_month;
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
    }
  };


  const getCoinsPerMonth = async () => {
      try {
          const response = await axios.get('statistics/admin/coins-per-month');
          coinsPerMonth.value = response.data.coins_per_month;
      } catch (error) {
          console.error('Error fetching coins per month:', error);
      }
  };


  const getPopularPurchaseMethod = async () => {
    try {
      const response = await axios.get('statistics/admin/viewPopularPurchaseMethod');
      popularPurchaseMethod.value = response.data.popular_purchase_method;
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
    }
  };

  const getGamesPerBoard = async () => {
    try {
      const response = await axios.get('statistics/games-per-board');
      boardData.value = response.data.games_by_board;

    } catch (error) {
      console.error('Error fetching games per board:', error);
    }
  };

  const statisticsAdmin = () => {
    getAdminStatistics(),
    getCoinsPerMonth()
    getPopularPurchaseMethod()
  };

  const statisticsAll = () => {
    getGeneralStatistics(),
    getGamesPerBoard(),
    getGamesPerMonth()
  };


  return {
    generalStats,
    adminStats,
    gamesPerMonth,
    boardData,
    coinsPerMonth,
    popularPurchaseMethod,
    statisticsAdmin,
    statisticsAll,
  };
});