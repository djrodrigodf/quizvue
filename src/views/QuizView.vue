<template>
  <div class="min-h-screen bg-[#CFE3CF] flex flex-col justify-between px-6 py-10 font-sans">
    <!-- Cabeçalho -->
    <div class="flex justify-between mb-10 items-center">
     <div>
       <div class="bg-[#547D5C] text-white text-center
       px-6 py-4 rounded mb-2 text-xl tracking-wider">
         DESCUBRA AS FRAGRÂNCIAS
       </div>
       <span >
         <p class="text-[#2E4D3A] ms-10">   Selecione o perfume e confirme para seguir para o próximo</p>
       </span>
     </div>
      <div>
        <img src="@/assets/logo-verde.png"  alt="ícone perfume"/>
      </div>
    </div>

    <!-- Perguntas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-6 flex-grow">
      <div
        v-for="(pergunta, index) in perguntas"
        :key="index"
        class="flex flex-col items-center gap-2 px-2 border-r-2 border-r-[#6FA286] last:border-r-0"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 flex items-center justify-center bg-[#547D5C] text-white text-xl font-bold rounded" style="height: 100%">
            {{ index + 1 }}
          </div>
          <div class="text-[14px] font-medium text-[#2E4D3A] text-left leading-tight whitespace-pre-line">
            {{ pergunta.texto }}
          </div>
        </div>

        <!-- Respostas -->
        <div class="flex flex-col gap-3 mt-4">
          <div
            v-for="(resposta, i) in pergunta.respostasEmbaralhadas"
            :key="i"
            @click="selecionarResposta(index, resposta.nome)"
            class="cursor-pointer border-4 rounded-md transition-all duration-200 p-1"
            :class="{
              'border-[#2E4D3A]': respostasSelecionadas[index] === resposta.nome,
              'border-transparent hover:border-green-300': respostasSelecionadas[index] !== resposta.nome
            }"
          >
            <img class="w-44 h-44 object-contain" :src="resposta.imagem" :alt="resposta.nome" />
          </div>
        </div>
      </div>
    </div>

    <!-- Botão -->
    <div class="text-right mt-6">
      <button
        @click="validarRespostas"
        class="bg-[#2E4D3A] text-white px-4 py-3 rounded hover:bg-[#1f3327] transition"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Resposta {
  nome: string
  imagem: string
}

interface Pergunta {
  texto: string
  respostas: Resposta[]
  correta: string
  respostasEmbaralhadas: Resposta[]
}

const router = useRouter()
const respostasSelecionadas = ref<string[]>(['', '', ''])

function selecionarResposta(perguntaIndex: number, resposta: string) {
  respostasSelecionadas.value[perguntaIndex] = resposta
}

const imagens = {
  pergunta1: {
    correta: new URL('@/assets/imgsperguntas/img-pergunta1-repost-certa.png', import.meta.url).href,
    erradas: [
      new URL('@/assets/imgsperguntas/img-pergunta1-repost-errada-1.png', import.meta.url).href,
      new URL('@/assets/imgsperguntas/img-pergunta1-repost-errada-2.png', import.meta.url).href
    ]
  },
  pergunta2: {
    correta: new URL('@/assets/imgsperguntas/img-pergunta2-repost-certa.png', import.meta.url).href,
    erradas: [
      new URL('@/assets/imgsperguntas/img-pergunta2-repost-errada-1.png', import.meta.url).href,
      new URL('@/assets/imgsperguntas/img-pergunta2-repost-errada-2.png', import.meta.url).href
    ]
  },
  pergunta3: {
    correta: new URL('@/assets/imgsperguntas/img-pergunta3-repost-certa.png', import.meta.url).href,
    erradas: [
      new URL('@/assets/imgsperguntas/img-pergunta3-repost-errada-1.png', import.meta.url).href,
      new URL('@/assets/imgsperguntas/img-pergunta3-repost-errada-2.png', import.meta.url).href
    ]
  }
}

const perguntas = ref<Pergunta[]>([
  {
    texto: 'AR DA MONTANHA\nCÍTRICO E NATURAL\nMENTA COM NOTAS VERDES E SÂNDALO',
    respostas: [
      { nome: 'Floratta Rose', imagem: imagens.pergunta1.erradas[0] },
      { nome: 'Arbo', imagem: imagens.pergunta1.correta },
      { nome: 'Malbec', imagem: imagens.pergunta1.erradas[1] }
    ],
    correta: 'Arbo',
    respostasEmbaralhadas: []
  },
  {
    texto: 'FLORAL FRESCO\nNOTAS AMADEIRADAS CREMOSAS\nGARDÊNIA',
    respostas: [
      { nome: 'Quasar', imagem: imagens.pergunta2.erradas[0] },
      { nome: 'Floratta Red', imagem: imagens.pergunta2.correta },
      { nome: 'Egeo', imagem: imagens.pergunta2.erradas[1] }
    ],
    correta: 'Floratta Red',
    respostasEmbaralhadas: []
  },
  {
    texto: 'ADOCIADO\nBAUNILHA\nSEDUÇÃO E DIVERSÃO',
    respostas: [
      { nome: 'Lily', imagem: imagens.pergunta3.erradas[0] },
      { nome: 'Egeo Dolce', imagem: imagens.pergunta3.correta },
      { nome: 'Floratta Rose', imagem: imagens.pergunta3.erradas[1] }
    ],
    correta: 'Egeo Dolce',
    respostasEmbaralhadas: []
  }
])

const todasRespondidas = computed(() =>
  respostasSelecionadas.value.every(r => r.trim() !== '')
)

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

function embaralhar(array: Resposta[]) {
  return array.slice().sort(() => Math.random() - 0.5)
}

onMounted(() => {
  perguntas.value.forEach(p => {
    p.respostasEmbaralhadas = embaralhar(p.respostas)
  })
})
</script>
