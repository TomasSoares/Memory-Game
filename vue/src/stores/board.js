import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useBoardStore = defineStore('board', () => {
    
    const storeAuth = useAuthStore();
    
    const boards = ref([]);

    const fetchBoards = async () => {
        try {
          // se tiver logado, retorna false, se não, true
          const bool = ref(storeAuth.user == null ? true : false);
          const response = await axios.get('/boards', {
              params: { bool: bool.value },
          });
          boards.value = response.data;
        } catch (error) {
          console.error('Error fetching boards:', error);
        }
    };

    return {
        boards,
        fetchBoards,
    }
})