<template>
  <div class="resultado">
    <h2>Resultado do Quiz</h2>

    <div v-if="resumo">
      <p><strong>ID:</strong> {{ resumo.id }}</p>
      <p><strong>Acertos:</strong> {{ resumo.acertos }}</p>
      <p><strong>Erros:</strong> {{ resumo.erros }}</p>

      <ul>
        <li v-for="(item, i) in resumo.resultado" :key="i">
          Pergunta {{ i + 1 }}:
          <span :class="{ certo: item.acertou, errado: !item.acertou }">
            {{ item.acertou ? 'Acertou ✅' : 'Errou ❌' }}
          </span>
        </li>
      </ul>
    </div>

    <button @click="voltarInicio">Reiniciar Quiz</button>

    <div v-if="estaOnline" style="margin-top: 20px">
      <button @click="sincronizarPendentes">Sincronizar todos os resultados</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { enviarResultado } from '@/services/supabase'

const route = useRoute()
const router = useRouter()

const estaOnline = ref(navigator.onLine)

window.addEventListener('online', () => (estaOnline.value = true))
window.addEventListener('offline', () => (estaOnline.value = false))

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

  // Sincroniza automático se online
  if (estaOnline.value) {
    enviarResultado(dados)
  }
}

function voltarInicio() {
  router.push('/')
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

carregarResultado()
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
