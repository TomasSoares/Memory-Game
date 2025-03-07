<template>
  <div class="coins-page">
    <div class="coins-container">
      <h1>Buy Brain Coins</h1>

      <form @submit.prevent="buyCoins">
        <div class="form-group">
          <label for="paymentType">Payment Type</label>
          <select v-model="paymentType" id="paymentType" required>
            <option value="" disabled>Select a payment method</option>
            <option value="MBWAY">MB WAY</option>
            <option value="PAYPAL">PayPal</option>
            <option value="IBAN">IBAN</option>
            <option value="MB">MB</option>
            <option value="VISA">Visa</option>
          </select>
        </div>

        <div class="form-group">
          <label for="reference">Payment Reference</label>
          <input v-model="reference" type="text" id="reference" placeholder="Enter payment reference" required />
        </div>

        <div class="form-group">
          <label for="coinValue">Number of Coins (multiples of 10)</label>
          <input v-model.number="coinValue" type="number" id="coinValue" min="10" step="10" placeholder="Enter amount"
            required />
        </div>

        <button type="submit" class="buy-button">Buy Coins</button>
      </form>

      <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
        {{ message }}
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useCoinsStore } from '@/stores/coins';

const storeCoins = useCoinsStore();

const paymentType = ref('');
const reference = ref('');
const coinValue = ref(10);
const message = ref('');
const isSuccess = ref(false);

const validatePaymentReference = (type, reference) => {
  const regexes = {
    MBWAY: /^9\d{8}$/,
    PAYPAL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    IBAN: /^[A-Z]{2}\d{23}$/,
    MB: /^\d{5}-\d{9}$/,
    VISA: /^4\d{15}$/,
  };
  return regexes[type]?.test(reference) || false;
};


const buyCoins = async () => {

  if (!validatePaymentReference(paymentType.value, reference.value)) {
    message.value = 'Invalid payment reference for the selected method.';
    isSuccess.value = false;

    return;
  }

  if (coinValue.value <= 0 || coinValue.value % 10 !== 0) {
    message.value = 'Coin value must be a positive multiple of 10.';
    isSuccess.value = false;

    return;
  }

  try {
    await storeCoins.purchaseCoins(paymentType.value, reference.value, coinValue.value);

    message.value = 'Coins purchased successfully!';
    isSuccess.value = true;

  } catch (error) {
    message.value = error.message || 'An error occurred while purchasing coins.';
    isSuccess.value = false;
  }
};

</script>

<style scoped>
.coins-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.coins-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, #1e1e2e, #27293d);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffffff;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.7);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffffff;
}

input,
select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #2c2c3a;
  color: #ffffff;
}

input::placeholder {
  color: #aaaaaa;
}

input:focus,
select:focus {
  outline: none;
  border: 1px solid #00e5ff;
  box-shadow: 0px 0px 5px #00e5ff;
}

.buy-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ffdc5c, #ffb94f);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
}

.buy-button:hover {
  background: linear-gradient(135deg, #f7d24b, #fb9b0c);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.6);
}

p.success {
  color: #00ff7f;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

p.error {
  color: #ff6347;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}
</style>