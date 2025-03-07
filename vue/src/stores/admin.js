import { ref } from "vue";
import { defineStore } from "pinia";
import { useToast } from '@/components/ui/toast/use-toast';
import axios from "axios";

export const useAdminStore = defineStore("admin", () => {
  const { toast } = useToast();

  const users = ref([]);
  const currentPage = ref(1);
  const lastPage = ref(1);

  const usersList = async (page = 1, nicknameFilter = '') => {
    try {
      const response = await axios.get('users/allUsers', {
        params: {
          page: page,
          nickname: nicknameFilter, // Passa o filtro de nickname para a API
        }
      });

      users.value = response.data.data;
      console.log(users.value);
      currentPage.value = response.data.current_page;
      lastPage.value = response.data.last_page;
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  const blockUser = async (id, nicknameFilter = '') => {
    try {
      const response = await axios.put('users/blockUser', { id });
      await usersList(currentPage.value, nicknameFilter);
      toast({
        title: "Sucesso",
        description: response.data.message,
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao bloquear o usuário", error);
    }
  };

  const unblockUser = async (id, nicknameFilter = '') => {
    try {
      const response = await axios.put('users/unblockUser', { id });
      await usersList(currentPage.value, nicknameFilter);
      toast({
        title: "Sucesso",
        description: response.data.message,
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao desbloquear o usuário", error);
    }
  };

  return {
    users,
    currentPage,
    lastPage,
    usersList,
    blockUser,
    unblockUser,
  };
});
