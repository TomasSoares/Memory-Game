import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import UserProfile from "@/components/auth/UserProfile.vue";
import Dashboard from '@/components/Dashboard.vue';
import Game from '@/components/game/Game.vue'
import NewGame from '@/components/game/NewGame.vue';
import GameHistory from '@/components/game/GameHistory.vue';
import Scoreboard from '@/components/game/Scoreboard.vue';
import Statistics from '@/components/statistics/Statistics.vue';
import Coins from '@/components/coins/Coins.vue';
import Admin from "@/components/admin/InformacionsUsers.vue";
import { useAuthStore } from "@/stores/auth";
import GameMultiplayer from '@/components/multiplayer/GameMultiplayer.vue';
import Lobby from '@/components/multiplayer/Lobby.vue';
import MyLobby from '@/components/multiplayer/MyLobby.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/userProfile",
      name: "userProfile",
      component: UserProfile,
    },
    {
      path: "/game/newGame",
      name: "newGame",
      component: NewGame,
    },
    {
      path: "/game/history",
      name: "gameHistory",
      component: GameHistory,
    },
    {
      path: "/game/scoreboard",
      name: "scoreboard",
      component: Scoreboard,
    },
    {
      path: "/game",
      name: "game",
      component: Game,
    },
    {
      path: '/multiplayer/game',
      name: 'gameMultiplayer',
      component: GameMultiplayer,
    },
    {
      path: '/multiplayer/Lobby',
      name: 'lobby',
      component: Lobby,
    },
    {
      path: '/multiplayer/MyLobby',
      name: 'mylobby',
      component: MyLobby,
    },
    {
      path: "/coins",
      name: "coins",
      component: Coins,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
    },
    {
      path: "/admin",
      name: "informationsUsers",
      component: Admin,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

let handlingFirstRoute = true;

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore();

  if (handlingFirstRoute) {
    handlingFirstRoute = false;
    await storeAuth.restoreToken();
  }

  const boardId = parseInt(to.query.boardId, 10);
  const allowedBoards = storeAuth.user ? [1, 2, 3] : [1];

  // User is logged in
  if (storeAuth.user && storeAuth.user.type == "P" && 
      (to.name == "login" || to.name == "register" || to.name == "informationsUsers")) {
    next({ name: "dashboard" });
    return;
  }

  // Admin loggerd with admin role just can see the scoreboard page, game history page, update user profile page
  if (storeAuth.user && storeAuth.user.type == "A" && 
      (to.name == "login" || to.name == "register" || to.name == "gameHistory" || to.name == "game"  || to.name == "newGame" || to.name == "coins")) {
    next({ name: "dashboard" });
    return;
  }

  // user is not logged in
  if ((to.name == "game" && !allowedBoards.includes(boardId)) || 
      (!storeAuth.user && (to.name == "gameHistory" || to.name == "coins" || to.name == "userProfile" || to.name == "userProfile" || to.name == "informationsUsers" || to.name == "gameMultiplayer" || to.name == "lobby" || to.name == "mylobby"))) {
    next({ name: "dashboard" });
    return;
  }

  if (to.name === "listgameslobby" && !storeAuth.user) {
    next({ name: "dashboard" });
    return;
  }
  next();
});

export default router;
