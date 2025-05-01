<template>
  <section class="min-h-screen bg-green-100 py-8 px-4 text-center">
    <div class="resultado">
      <h2>Resultado do Quiz</h2>

      <div v-if="resumo">
        <p><strong>Acertos:</strong> {{ resumo.acertos }}</p>
        <p><strong>Erros:</strong> {{ resumo.erros }}</p>

        <ul>
          <li v-for="(item, i) in resumo.resultado" :key="i">
            Pergunta {{ i + 1 }}:
            <span :class="{ certo: item.acertou, errado: !item.acertou }">
              {{ item.acertou ? 'Acertou' : 'Errou' }}
            </span>
          </li>
        </ul>
      </div>

      <button
        class="mt-10 bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition"
        @click="voltarInicio"
      >
        Reiniciar Quiz
      </button>

      <div v-if="estaOnline" style="margin-top: 20px">
        <button
          class="mt-10 bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition"
          @click="sincronizarPendentes"
        >
          Sincronizar todos os resultados
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { enviarResultado } from '@/services/supabase'

// Router
const route = useRoute()
const router = useRouter()

// Estado de conectividade
const estaOnline = ref(false)

// Dados do resumo
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

// Verifica se está online usando HTTP simples (sem HTTPS)
async function checarOnline() {
  try {
    await fetch('http://httpbin.org/get', { method: 'GET' })
    estaOnline.value = true
  } catch {
    estaOnline.value = false
  }
}

// Carrega os dados do resultado salvos no localStorage
function carregarResultado() {
  const id = route.query.id as string
  const raw = localStorage.getItem(`quiz_${id}`)
  if (!raw) return

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

  // Sincroniza automaticamente se estiver online
  if (estaOnline.value) {
    enviarResultado(dados)
  }
}

// Volta para a tela inicial
function voltarInicio() {
  router.push('/')
}

// Sincroniza todos os resultados offline armazenados
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

// Executa ao montar componente
onMounted(async () => {
  await checarOnline()
  carregarResultado()
})
</script>

<style scoped>
.resultado {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

li {
  margin: 8px 0;
}

.certo {
  color: green;
}

.errado {
  color: red;
}

button {
  margin-top: 30px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
}
</style>
