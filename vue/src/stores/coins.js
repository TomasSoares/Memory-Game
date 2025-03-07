import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useCoinsStore = defineStore('coins', () => {

  const gameCoins = ref();

  const getCoins = async () => {
    try {
      const response = await axios.get('users/me/coins');
      gameCoins.value = response.data.coins;
    } catch (error) {
      console.error('Error in Getting Coins:', error);
    }
  };

  const purchaseCoins = async (type, reference, value) => {
    try {
      const payload = { type, reference, value: value / 10 };
      const paymentResponse = await axios.post('https://dad-202425-payments-api.vercel.app/api/debit', payload);

      if (paymentResponse.status === 201) {

        const backendPayload = { type, reference, value };
        const response = await axios.post('users/me/coins/purchase', backendPayload);

        if (response.status === 200) {
          gameCoins.value += backendPayload.value;

        } else {
          throw new Error('Payment validation failed. Please check your details.');
        }
      }
    } catch (error) {
      console.error('Error on Buying Coins:', error);
    }
  };

  const spendCoins = async (value) => {
    if (gameCoins.value >= value) {
      const response = await axios.post('users/me/coins/spend', {value} );
      getCoins();
    } else {
      throw new Error('Insufficient coins.');
    }
  };
  

  return {
    gameCoins,
    getCoins,
    purchaseCoins,
    spendCoins
  }
});
