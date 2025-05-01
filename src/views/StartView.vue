<template>
  <section class="bg-green-100">
    <div class="start-screen">
      <h2 class="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Bem-vindo ao Quiz do Boticário!</h2>
      <button class="mt-10 bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition" @click="startQuiz">Iniciar Quiz</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function startQuiz() {
  router.push('/quiz')
}
</script>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
}
</style>
