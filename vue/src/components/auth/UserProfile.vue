<script setup>
  import { useTemplateRef, provide, computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { useAuthStore } from '@/stores/auth'
  import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'

  const storeAuth = useAuthStore()

  const alertDialog = useTemplateRef('alert-dialog')
  provide('alertDialog', alertDialog)

  const newCredentials = computed(() => ({
    name: storeAuth.user.name,
    email: storeAuth.user.email,
    nickname: storeAuth.user.nickname,
    password: '',
    confirmPassword: ''
  }))

  const updateProfile = () => {
      storeAuth.updateProfile(newCredentials.value)
  }

  const deleteConfirmed = () => {
    storeAuth.deleteAccount()
  }

  const deleteAccount = () => {
    alertDialog.value.open(
      deleteConfirmed,
      'Delete confirmation?',
      'Cancel',
      'Yes, I want to delete my account',
      'Are you sure you want to delete your account? You will lose all your data and will not be able to recover it.'
    )
  }

</script>

<template>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="update-page">
    <Card class="update-card">
      <CardHeader>
        <CardTitle class="update-title">Update profile</CardTitle>
        <CardDescription class="update-description">Enter your new credentials to update.</CardDescription>
        <CardDescription  v-if="storeAuth.success" class="text-success"> User updated successfully </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">name</Label>
              <!-- Input com o valar default -->
              <Input id="name" type="name" placeholder="Name" v-model="newCredentials.name"/>
              <ErrorMessage v-if="storeAuth.errorsUpdateProfile.name" :errorMessage="storeAuth.errorsUpdateProfile.name" > </ErrorMessage>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="Email"  v-model="newCredentials.email"/>
              <ErrorMessage v-if="storeAuth.errorsUpdateProfile.email" :errorMessage="storeAuth.errorsUpdateProfile.email" > </ErrorMessage>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="nickname">Nickname</Label>
              <Input id="nickname" type="name" placeholder="Nickname"  v-model="newCredentials.nickname"/>
              <ErrorMessage v-if="storeAuth.errorsUpdateProfile.nickname" :errorMessage="storeAuth.errorsUpdateProfile.nickname" > </ErrorMessage>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" v-model="newCredentials.password"/>
              <ErrorMessage v-if="storeAuth.errorsUpdateProfile.password" :errorMessage="storeAuth.errorsUpdateProfile.password" > </ErrorMessage>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Confirm password</Label>
              <Input id="confirmpassword" type="password" placeholder="Confirm password" v-model="newCredentials.confirmPassword"/>
              <ErrorMessage v-if="storeAuth.errorsUpdateProfile.confirmPassword" :errorMessage="storeAuth.errorsUpdateProfile.confirmPassword" > </ErrorMessage>
            </div>
          </div>
        </form>  
      </CardContent>
        <CardFooter class="justify-center">
          <Button class="delete-button simple-button" @click="deleteAccount">
              Delete account
          </Button>
          <Button class="simple-button" @click="updateProfile">
              Update profile
          </Button>
        </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
  .text-success {
      color: green;
      font-weight: bold;
    }

  .update-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, rgb(3, 0, 19), #131329);
    color: #ffffff;
  }


  .update-card {
    background: linear-gradient(135deg, #15152b, rgb(3, 0, 19));
    border: none;
    border-radius: 12px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.6);
    padding: 24px;
    color: #ffffff;
  }

  .update-title {
    text-align: center;
    font-size: 2rem;
    color: #ffffff;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
  }

  .update-description {
    color: #d1d5db; 
    font-size: 1rem;
  }

  .delete-button {
    background-color: #f14141 !important;
  }

  .simple-button {
    background-color: #1e1e2f;
    color: #ffffff;
    font-size: 1rem;
    border: 1px solid #4a4a6a;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 10px;
    margin-left: 10px;
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

