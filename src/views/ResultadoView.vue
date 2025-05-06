<template>
  <div class="min-h-screen bg-[#CFE3CF]">

    <div class="flex justify-between py-10 px-8">
      <div class="bg-[#547D5C] text-white px-10 py-6 rounded mb-4 text-xl font-bold tracking-wider">
        DESCUBRA AS FRAGRÂNCIAS
      </div>
      <div>
        <img src="@/assets/logo-verde.png" alt="ícone perfume" />
      </div>
    </div>

    <div class="text-[#2E4D3A] flex flex-col items-center justify-center px-4 text-center font-sans">

      <h1 class="text-5xl font-medium mb-4">RESULTADO FINAL</h1>

      <div class="text-8xl font-bold mb-6">{{ resumo?.acertos }} / {{ total }}</div>

      <div class="text-3xl font-semibold leading-snug mb-4 whitespace-pre-line" v-if="mensagem">
        {{ mensagem }}
      </div>

      <p class="text-2xl mt-2">
        Obrigado por participar,<br />
        escolha seu brinde com o promotor.
      </p>

      <button
        v-if="mostrarBotao"
        @click="voltarInicio"
        class="mt-10 bg-[#2E4D3A] gap-6 flex justify-center text-2xl items-center text-white px-6 py-3 rounded hover:bg-[#1f3327] transition"
      >
        <span>JOGAR NOVAMENTE</span> <span class="text-right">▶</span>
      </button>

      <button
        v-if="estaOnline"
        @click="sincronizarPendentes"
        class="mt-6 bg-[#2E4D3A] text-white text-lg px-6 py-3 rounded hover:bg-[#1f3327] transition"
      >
        SINCRONIZAR TODOS OS RESULTADOS
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { enviarResultado } from '@/services/supabase'

const route = useRoute()
const router = useRouter()

const estaOnline = ref(false)
const mostrarBotao = ref(false)

const resumo = ref<null | {
  id: string
  resultado: {
    correta: string
    selecionada: string
    acertou: boolean
  }[]
  acertos: number
  erros: number
}>(null)

const total = computed(() => resumo.value?.resultado.length ?? 0)

const mensagem = computed(() => {
  if (!resumo.value) return ''
  const acertos = resumo.value.acertos
  switch (acertos) {
    case 0:
      return `Puxa... Que tal conhecer mais sobre nossas fragrâncias?\nExperimente essas e outras na nossa loja.`
    case 1:
      return `Que legal, você nos conhece!\nTemos essas e muitas outras fragrâncias para conhecer.\nPasse na nossa loja e experimente.`
    case 2:
      return `UAU! Você é quase um expert!\nTemos essas e muitas outras fragrâncias para conhecer.\nPasse na nossa loja e experimente.`
    case 3:
      return `Parabéns! Você é um especialista!\nExperimente essas e outras fragrâncias na nossa loja.`
    default:
      return ''
  }
})

function voltarInicio() {
  router.push('/')
}

async function temInternetDeVerdade(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    await fetch("https://rest.ensembl.org/info/ping?content-type=application/json", {
      method: "GET",
      signal: controller.signal
    })

    clearTimeout(timeout)
    return true
  } catch {
    return false
  }
}

async function sincronizarPendentes() {
  const chaves = Object.keys(localStorage).filter(k => k.startsWith('quiz_'))
  let enviados = 0

  for (const chave of chaves) {
    const raw = localStorage.getItem(chave)
    if (!raw) continue

    try {
      const dado = JSON.parse(raw)
      await enviarResultado(dado)
      enviados++
    } catch (e) {
      console.error(`Erro ao sincronizar ${chave}`, e)
    }
  }

  alert(`${enviados} resultado(s) sincronizado(s) com sucesso!`)
}

function carregarResultado() {
  const id = route.query.id as string
  const raw = localStorage.getItem(`quiz_${id}`)
  if (!raw) return router.push('/')

  const dados = JSON.parse(raw)
  const resultado = dados.resultado
  const acertos = resultado.filter((r: any) => r.acertou).length
  const erros = resultado.length - acertos

  resumo.value = {
    id: dados.id,
    resultado,
    acertos,
    erros
  }



  mostrarBotao.value = true
}

onMounted(async () => {
  estaOnline.value = await temInternetDeVerdade()
  carregarResultado()
})
</script>
