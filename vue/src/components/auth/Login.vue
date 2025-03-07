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
      email: '',
      password: ''
  })

  const login = () => {
    storeAuth.login(credentials.value)
  }

  const goToDashboard = () => {
    router.push({ name: 'dashboard' });
  };

  const goToRegister = () => {
    router.push({ name: 'register' });
  };
</script>

<template>
  <div class="login-page">
    <Card class="login-card">
      <CardHeader>
        <CardTitle class="login-title">Login</CardTitle>
        <CardDescription class="login-description">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" type="password" v-model="credentials.password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button @click="goToDashboard" class="dashboard-button">Dashboard</Button>
        <Button @click="goToRegister" class="simple-button">Register</Button>
        <Button @click="login" class="simple-button">Login</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
  color: #ffffff;
}


.login-card {
  background: linear-gradient(135deg, #15152b, rgb(3, 0, 19));
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  padding: 24px;
  color: #ffffff;
}


.login-title {
  text-align: center;
  font-size: 2rem;
  color: #ffffff;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
}

.login-description {
  color: #d1d5db; 
  font-size: 1rem;
}

.simple-button {
  background-color: #1e1e2f;
  color: #ffffff;
  font-size: 1rem;
  padding: 10px 20px;
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


.dashboard-button {
  background-color: #ded7d7;
  color: #131329; /* Cor escura para contraste */
  font-size: 1rem;
  padding: 10px 20px;
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


input {
  border: 2px solid #333333;
  border-radius: 8px;
  background: #1e1e2f;
  color: #ffffff;
  padding: 10px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}
</style>
