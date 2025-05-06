<template>

  <section class="flex justify-center items-center bg-[#6FA286]" style="height: 100vh">
    <div class="text-center w-full max-w-[600px] px-4">
      <div>
        <img src="@/assets/logo.png" alt="ícone perfume" class="mx-auto" />
        <div class="bg-[#CDE7CA] mx-6 px-6 py-4 rounded mb-6 mt-6">
          <span class="text-[#2E4D3A] font-bold text-xl">DESCUBRA AS FRAGRÂNCIAS</span>
        </div>
      </div>

      <div class="text-2xl">
        <p class="text-white mb-2">Você consegue adivinhar quais foram</p>
        <p class="text-white mb-4">as 3 fragrâncias que experimentou?</p>
        <p class="text-white font-bold mb-10">ACERTE E GANHE BRINDES!</p>
      </div>

      <button class="bg-[#34544C] text-[#CCE6C9] px-6 py-3 rounded font-semibold text-lg hover:bg-[#1f3327] transition"
              @click="startQuiz">
        COMEÇAR ▶
      </button>

      <div class="mt-16">
        <img src="@/assets/simbolo.png" alt="ícone perfume" class="mx-auto w-10" />
      </div>
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
