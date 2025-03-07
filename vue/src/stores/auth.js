import { ref, computed, inject } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "@/stores/error";
import { useCoinsStore } from "@/stores/coins";
import { useStatisticsStore } from "@/stores/statistics";
import { useBoardStore } from "@/stores/board";
import { useRouter } from "vue-router";
import avatarNoneAssetURL from "@/assets/avatar-none.png";
import { useToast } from "@/components/ui/toast/use-toast";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const storeError = useErrorStore();
  const socket = inject('socket');
  const storeCoins = useCoinsStore();
  const storeStatistics = useStatisticsStore();
  const storeBoard = useBoardStore();
  const { toast } = useToast();

  const user = ref(null);
  const token = ref("");

  const errorLogin = ref(false);
  const errorsRegister = ref([]);
  const errorsUpdateProfile = ref([]);
  const success = ref(false);

  const userName = computed(() => {
    return user.value ? user.value.name : "";
  });
  
  const userEmail = computed(() => {
    return user.value ? user.value.email : "";
  });

  const userNickname = computed(() => {
    return user.value ? user.value.nickname : "";
  });
  
  const userType = computed(() => {
    return user.value ? user.value.type : "";
  });

  const userPhotoUrl = computed(() => {
    const photoFile = user.value ? user.value.photoFileName ?? "" : "";
    if (photoFile) {
      return `http://${inject("serverBaseUrl")}${photoFile}`;
    }
    return avatarNoneAssetURL;
  });

  // This function is "private" - not exported by the store
  const clearUser = () => {
    resetIntervalToRefreshToken();
    if (user.value) {
      socket.emit('logout', user.value)
  }   
    user.value = null;
    axios.defaults.headers.common.Authorization = "";
    localStorage.removeItem("token");
  };

  const login = async (credentials) => {
    storeError.resetMessages();
    try {
      const responseLogin = await axios.post("auth/login", credentials);
      token.value = responseLogin.data.token;
      axios.defaults.headers.common.Authorization = "Bearer " + token.value;
      localStorage.setItem("token", token.value);
      const responseUser = await axios.get("users/me");
      user.value = responseUser.data.data;
      socket.emit('login', user.value)
      repeatRefreshToken();
      storeCoins.getCoins();
      storeBoard.fetchBoards();
      router.push({ name: "dashboard" });
      return user.value;
    } catch (e) {
      clearUser();
      console.log(e.response.data.message)
      if (e.response.data.message == "Unauthorized") {
        toast({
          title: "Unauthorized",
          description: "Please, check your email and password.",
          variant: 'destructive'
        })
      }else if (e.response.data.message == "User blocked") {
        toast({
          title: "Unauthorized",
          description: "User blocked. Please contact the administrator.",
          variant: 'destructive'
        })
      }else{
        storeError.setErrorMessages(
          e.response.data.message,
          e.response.data.errors,
          e.response.status,
          "Authentication Error!"
        );
      }
      return false;
    }
  };

  const register = async (credentials) => {
    storeError.resetMessages(); // Reseta mensagens de erro antes de iniciar
    try {
      await axios.post("auth/register", credentials);
  
      return loginResponse = await login({
        email: credentials.email,
        password: credentials.password,
      });

    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        "Registration Error!"
      );
      if (e.response?.data.errors != null) {
        errorsRegister.value = e.response.data.errors;
      }
      return false;
    }
  };

  const updateProfile = async (credentials) => {
    storeError.resetMessages(); // Reseta mensagens de erro antes de iniciar
    try {
      errorsUpdateProfile.value = [];
      success.value = false;
      const responseUser = await axios.put("auth/updateProfile", credentials);
      user.value = null;
      user.value = responseUser.data.data;
      success.value = true;
    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        "Registration Error!"
      );
      if (e.response?.data.errors != null) {
        errorsUpdateProfile.value = e.response.data.errors;
      }
      return false;
    }
  };

  const logout = async () => {
    storeError.resetMessages();
    try {
      router.push({ name: 'dashboard' })
      await axios.post("auth/logout");
      clearUser();
      storeBoard.fetchBoards();
      return true;
    } catch (e) {
      clearUser();
      storeError.setErrorMessages(
        e.response.data.message,
        [],
        e.response.status,
        "Authentication Error!"
      );
      return false;
    }
  };

  const deleteAccount = async () => {
    storeError.resetMessages();
    try {
      router.push({ name: 'dashboard' })
      await axios.delete("auth/deleteAccount");
      clearUser();
      toast({
        title: "Account deleted",
        description: "Your account has been deleted."
      })
    } catch (e) {
      clearUser();
      storeError.setErrorMessages(
        e.response.data.message,
        [],
        e.response.status,
        "Authentication Error!"
      );
      return false;
    }
  };

  // These 2 functions and intervalToRefreshToken variable are "private" - not exported
  let intervalToRefreshToken = null;
  const resetIntervalToRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken);
    }
    intervalToRefreshToken = null;
  };

  const repeatRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken);
    }
    intervalToRefreshToken = setInterval(async () => {
      try {
        const response = await axios.post("auth/refreshtoken");
        token.value = response.data.token;
        axios.defaults.headers.common.Authorization = "Bearer " + token.value;
        localStorage.setItem("token", token.value);
        return true;
      } catch (e) {
        clearUser();
        storeError.setErrorMessages(
          e.response.data.message,
          e.response.data.errors,
          e.response.status,
          "Authentication Error!"
        );
        return false;
      }
    }, 1000 * 60 * 110); // repeat every 110 minutes
    // To test the refresh token, replace previous line with the following code
    // This will repeat the refreshtoken endpoint every 10 seconds:
    //}, 1000 * 10)
    return intervalToRefreshToken;
  };


  const restoreToken = async function () {
    let storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        token.value = storedToken;
        axios.defaults.headers.common.Authorization = "Bearer " + token.value;
        const responseUser = await axios.get("users/me");
        storeCoins.getCoins();
        user.value = responseUser.data.data;
        socket.emit('login', user.value)
        repeatRefreshToken();
        return true;
      } catch {
        clearUser();
        return false;
      }
    }
    return false;
  };

  return {
    user,
    userName,
    userEmail,
    userNickname,
    userType,
    userPhotoUrl,
    errorLogin,
    errorsRegister,
    errorsUpdateProfile,
    success,
    register,
    login,
    logout,
    restoreToken,
    updateProfile,
    deleteAccount
  };
});
