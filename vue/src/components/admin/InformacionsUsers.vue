<script setup>
  import { ref, useTemplateRef, provide, onMounted, computed, watch } from "vue";
  import { useAdminStore } from "@/stores/admin";
  import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'

  const adminStore = useAdminStore();

  const alertDialog = useTemplateRef('alert-dialog');
  provide('alertDialog', alertDialog);

  const nicknameFilter = ref("");
  const currentPage = ref(1);

  onMounted(() => {
    adminStore.usersList(1, nicknameFilter.value);
  });

  watch([nicknameFilter, currentPage], () => {
    adminStore.usersList(currentPage.value, nicknameFilter.value);
  });

  const changePage = (page) => {
    if (page >= 1 && page <= adminStore.lastPage) {
      currentPage.value = page;
    }
  };

  const toggleBlockUser = (user) => {
    const action = user.blocked === 0 ? "bloquear" : "desbloquear";
    const confirmationMessage = `Tem certeza que deseja ${action} o usuário ${user.name}?`;

    alertDialog.value.open(
      async () => {
        if (user.blocked === 0) {
          await adminStore.blockUser(user.id, nicknameFilter.value);
        } else {
          await adminStore.unblockUser(user.id, nicknameFilter.value);
        }
      },
      `${action.charAt(0).toUpperCase() + action.slice(1)} usuário`,
      "Cancelar",
      `Sim, quero ${action}`,
      confirmationMessage
    );
  };
</script>

<template>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="user-list-container">
    <h1>Users</h1>

    <input 
      type="text" 
      v-model="nicknameFilter" 
      placeholder="Filtrar por nickname..."
      class="filter-input"
    />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Nickname</th>
          <th>Email</th>
          <th>Total coins</th>
          <th>Total transactions</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in adminStore.users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.nickname }}</td>
          <td>{{ user.email }}</td>
          <td>
            <div>
              {{ user.total_brain_coins }} 
              <img src="@/assets/brain-coin.png" alt="Coins" />
            </div>
          </td>
          <td>{{ user.total_transactions }}</td>
          <td>
            <button 
              :class="user.blocked === 0 ? 'block-button' : 'unblock-button'" 
              @click="toggleBlockUser(user)">
              {{ user.blocked === 0 ? "Bloquear" : "Desbloquear" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls">
      <button 
        class="user-list-button" 
        @click="changePage(adminStore.currentPage - 1)" 
        :disabled="adminStore.currentPage === 1">
        Previous
      </button>
      <span>Page {{ adminStore.currentPage }} of {{ adminStore.lastPage }}</span>
      <button 
        class="user-list-button" 
        @click="changePage(adminStore.currentPage + 1)" 
        :disabled="adminStore.currentPage === adminStore.lastPage">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  }

  .user-list-container {
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

  th,td {
    padding: 15px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
  }

  td div {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  td img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
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

  .user-list-button {
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

  .user-list-button:hover {
    background-color: #253544;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  .user-list-button:disabled {
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

  .block-button {
    background: linear-gradient(135deg, #842112, #f14141);
    color: #ffffff;
    font-size: 1.2rem;
    padding: 8px 20px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  }

  .block-button:hover {
    background: linear-gradient(135deg, #f14141, #842112);
    transform: translateY(-3px);
  }

  .unblock-button {
    background: linear-gradient(135deg, #183c53, #1b78ce);
    color: #ffffff;
    font-size: 1.2rem;
    padding: 8px 20px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  }

  .unblock-button:hover {
    background: linear-gradient(135deg, #1b78ce, #183c53);
    transform: translateY(-3px);
  }

  .filter-input {
    padding: 8px;
    font-size: 16px;
    margin-bottom: 10px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

</style>