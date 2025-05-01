import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mqclgniyktucsgygqsye.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xY2xnbml5a3R1Y3NneWdxc3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTUxMjEsImV4cCI6MjA2MTYzMTEyMX0.kPmofxJWqG-pMy_lTVoBVJwhVn_bWFKFvkJiLakulMo'
)

export async function enviarResultado(dado: any) {
  const { data, error } = await supabase
    .from('quiz_resultados')
    .insert([
      {
        id: dado.id,
        respostas: dado.resultado,
        data_envio: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Erro ao enviar resultado:', error.message)
  } else {
    console.log('Resultado enviado com sucesso:', data)
    localStorage.removeItem(`quiz_${dado.id}`)
  }
}
