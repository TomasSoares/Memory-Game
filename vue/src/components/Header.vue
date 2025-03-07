<script setup>
  import { useTemplateRef, provide } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useCoinsStore } from '@/stores/coins';
  import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
  
  const storeAuth = useAuthStore()
  const storeCoins = useCoinsStore();
  
  const alertDialog = useTemplateRef('alert-dialog')
  provide('alertDialog', alertDialog)


  const logoutConfirmed = () => {
    storeAuth.logout()
  }

  const logout = () => {
    alertDialog.value.open(
      logoutConfirmed,
      'Logout confirmation?',
      'Cancel',
      'Yes, I want to log out',
      'Are you sure you want to log out? You can still access your account later with your credentials.'
    )
  }
</script>

<template>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <header class="header">
    <!-- Título -->
    <router-link to="/" class="header-link">
      <h1 class="header-title">Memory Game</h1>
    </router-link>
    <div> 
      <div class="coins" v-if="storeAuth.user">
        <img class="coin-icon" :src="storeAuth.userPhotoUrl" alt="Rounded avatar">
        <router-link to="/userProfile" class="header-link">
          <h2> {{ storeAuth.userNickname }}</h2>
        </router-link>
      </div>
      <div class="coins" v-else>
        <h2>Anónimo</h2>
      </div>
    </div>

    <!-- Moedas -->
    <div v-if="storeAuth.user && storeAuth.user.type == 'P'" class="coins">
      <img src="@/assets/brain-coin.png" alt="Coins" class="coin-icon" />
      <span class="coin-count">{{ storeCoins.gameCoins }}</span>
    </div>

    <!-- Botões de Login/Logout -->
    <div class="buttons">
      <RouterLink
        v-show="!storeAuth.user"
        :to="{ name: 'login' }"
        class="login-button"
      >
        Login
      </RouterLink>
      <button
        v-show="storeAuth.user"
        @click="logout"
        class="logout-button"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(135deg, rgb(6, 2, 38), #15152b);
  color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.header-title {
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.coins {
  display: flex;
  align-items: center;
  gap: 5px;
}

.coin-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.coin-count {
  font-size: 1.2rem;
}

.header .login-button,
.header .logout-button {
  margin-left: 15px; /* Espaçamento entre o botão e outros elementos */
}

.header .coins:first-child {
  margin-right: 15px; /* Espaçamento entre as seções de avatar/moedas */
}

/* Login button com tamanho menor */
.login-button {
  text-decoration: none;
  color: #333333; /* Cor do texto */
  font-size: 1.1rem;
  padding: 10px 18px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background: linear-gradient(135deg, #ffffff, #f2f2f2); /* Gradiente branco */
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Leve sombra */
  display: inline-block;
}

.login-button:hover {
  background: linear-gradient(135deg, #f2f2f2, #e0e0e0); /* Cinza mais escuro no hover */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-3px);
}

.login-button:active {
  transform: translateY(1px);
}

/* Botão de logout */
.logout-button {
  background: linear-gradient(135deg, #253544, #4A6A88);
  color: #ffffff;
  font-size: 1.2rem;
  padding: 8px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #4A6A88, #253544);
  transform: translateY(-3px);
}

.logout-button:active {
  transform: translateY(1px);
}
</style>
