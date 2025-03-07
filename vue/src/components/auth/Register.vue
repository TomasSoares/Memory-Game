<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const storeAuth = useAuthStore()

  const credentials = ref({
      name: '',
      email: '',
      password: '',
      nickname: '',
  })

  const register = () => {
      storeAuth.register(credentials.value)
  }

  const goToDashboard = () => {
    router.push({ name: 'dashboard' });
  };

  const goToLogin = () => {
    router.push({ name: 'login' });
  };
</script>

<template>
  <div class="register-page">
    <Card class="register-card">
      <CardHeader>
        <CardTitle class="register-title">Register</CardTitle>
        <CardDescription class="register-description">
          Enter your details to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-6">
            <div class="flex flex-col space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" type="text" placeholder="User Name" v-model="credentials.name" />
            </div>
            <div class="flex flex-col space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" />
            </div>
            <div class="flex flex-col space-y-2">
              <Label for="nickname">Nickname</Label>
              <Input id="nickname" type="text" placeholder="User Nickname" v-model="credentials.nickname" />
            </div>
            <div class="flex flex-col space-y-2">
              <Label for="password">Password</Label>
              <Input id="password" type="password" v-model="credentials.password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between gap-4 px-6 pb-6">
        <Button @click="goToDashboard" class="dashboard-button">Dashboard</Button>
        <Button @click="goToLogin" class="simple-button">Login</Button>
        <Button @click="register" class="simple-button">Register</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
/* Background estilo */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  color: #ffffff;
}

/* Card estilo - aumentar a caixa */
.register-card {
  background: linear-gradient(135deg, #15152b, rgb(3, 0, 19));
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  padding: 22px 33px; /* Aumentei o padding para maior espaçamento */
  color: #ffffff;
  width: 450px; /* Aumentei a largura */
  max-width: 90vw; /* Ajuste para responsividade */
}

/* Título e descrição */
.register-title {
  font-size: 2rem;
  color: #ffffff;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
}

.register-description {
  color: #d1d5db; /* Cor cinza clara */
  font-size: 1rem;
}

/* Botões simplificados - Menores e com espaçamento */
.simple-button {
  background-color: #1e1e2f;
  color: #ffffff;
  font-size: 0.9rem; /* Tamanho de fonte menor */
  padding: 8px 16px; /* Botões menores */
  border: 1px solid #4a4a6a;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.simple-button:hover {
  background-color: #2a2a40;
  transform: translateY(-2px);
}

.simple-button:active {
  background-color: #3a3a50;
  transform: translateY(1px);
}

/* Botão Dashboard - Branco */
.dashboard-button {
  background-color: #ffffff;
  color: #131329; /* Cor escura para contraste */
  font-size: 0.9rem; /* Tamanho de fonte menor */
  padding: 8px 16px; /* Botões menores */
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.dashboard-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.dashboard-button:active {
  background-color: #e0e0e0;
  transform: translateY(1px);
}

/* Input estilo */
input {
  border: 2px solid #333333;
  border-radius: 8px;
  background: #1e1e2f;
  color: #ffffff;
  padding: 12px; 
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}
</style>
