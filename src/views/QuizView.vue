<template>
  <div class="min-h-screen bg-green-100 py-8 px-4 text-center">
    <h1 class="text-3xl font-bold text-green-900 mb-10">Descubra as Fragrâncias</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div
        v-for="(pergunta, index) in perguntas"
        :key="index"
        class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
      >
        <div class="text-sm text-gray-500 mb-1">PERGUNTA {{ index + 1 }}</div>
        <h2 class="text-lg font-semibold text-green-800 mb-2">{{ pergunta.texto }}</h2>

        <div class="grid grid-cols-1 gap-3 mt-4">
          <div
            v-for="(resposta, i) in pergunta.respostasEmbaralhadas"
            :key="i"
            @click="selecionarResposta(index, resposta)"
            class="cursor-pointer border-4 rounded-md transition-all duration-200"
            :class="{
              'border-green-500': respostasSelecionadas[index] === resposta,
              'border-transparent hover:border-green-300': respostasSelecionadas[index] !== resposta
            }"
          >
            <img
              class="w-28 h-28 object-contain mx-auto"
              :src="placeholderImg[i]"
              :alt="resposta"
            />
            <p class="text-sm mt-2">{{ resposta }}</p>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="todasRespondidas"
      @click="validarRespostas"
      class="mt-10 bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition"
    >
      Validar Respostas
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Pergunta {
  texto: string
  respostas: string[]
  correta: string
  respostasEmbaralhadas: string[]
}

const router = useRouter()

const perguntas = ref<Pergunta[]>([
  {
    texto: 'AR DA MONTANHA\nCítrico e Natural',
    respostas: ['Resposta 1', 'Resposta 2', 'Resposta 3'],
    correta: 'Resposta 2',
    respostasEmbaralhadas: []
  },
  {
    texto: 'FLORAL FRESCO\nNotas Amadeiradas Cremosas',
    respostas: ['Resposta 4', 'Resposta 5', 'Resposta 6'],
    correta: 'Resposta 5',
    respostasEmbaralhadas: []
  },
  {
    texto: 'ADOÇICADO\nBaunilha, Sedução e Diversão',
    respostas: ['Resposta 7', 'Resposta 8', 'Resposta 9'],
    correta: 'Resposta 8',
    respostasEmbaralhadas: []
  }
])

const respostasSelecionadas = ref<string[]>(['', '', ''])

const todasRespondidas = computed(() =>
  respostasSelecionadas.value.every(r => r.trim() !== '')
)

function selecionarResposta(perguntaIndex: number, resposta: string) {
  respostasSelecionadas.value[perguntaIndex] = resposta
}

function validarRespostas() {
  if (!todasRespondidas.value) {
    alert('Responda todas as perguntas antes de validar.')
    return
  }

  const resultado = perguntas.value.map((p, i) => ({
    correta: p.correta,
    selecionada: respostasSelecionadas.value[i],
    acertou: respostasSelecionadas.value[i] === p.correta
  }))

  const id = crypto.randomUUID()
  const data = {
    id,
    resultado,
    timestamp: new Date().toISOString()
  }

  localStorage.setItem(`quiz_${id}`, JSON.stringify(data))

  router.push({ name: 'resultado', query: { id } })
}

function embaralhar(array: string[]) {
  return array.slice().sort(() => Math.random() - 0.5)
}

onMounted(() => {
  perguntas.value.forEach(p => {
    p.respostasEmbaralhadas = embaralhar(p.respostas)
  })
})

// imagens genéricas para simular perfumes
const placeholderImg = [
  'https://placehold.co/100x100?text=1',
  'https://placehold.co/100x100?text=2',
  'https://placehold.co/100x100?text=3'
]
</script>
