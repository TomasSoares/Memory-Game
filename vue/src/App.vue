<script setup>
  import Header from './components/Header.vue';
  import Toaster from '@/components/ui/toast/Toaster.vue'
  import { useBoardStore } from '@/stores/board'

  const storeBoard = useBoardStore();
  storeBoard.fetchBoards();
</script>

<template>
  <Header />
  <main>
    <div id="app">
      <Toaster />
      <router-view />
    </div>
  </main>
</template>

<style scoped>
  #app {
    min-height: 100vh;
  }
</style>



