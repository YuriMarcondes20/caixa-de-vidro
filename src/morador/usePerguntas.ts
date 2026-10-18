import { useCallback, useMemo, useState } from 'react'
import { dataHora } from '../format'
import { PERGUNTAS_SEED, PRAZO_DIAS, type Alvo, type Pergunta } from './dados'

const K_CRIADAS = 'caixa-de-vidro:perguntas'
const K_SEGUINDO = 'caixa-de-vidro:seguindo'

function ler<T>(chave: string, vazio: T): T {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto ? (JSON.parse(bruto) as T) : vazio
  } catch {
    return vazio
  }
}

function gravar(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* sem armazenamento: vale só nesta sessão */
  }
}

export interface PerguntasApi {
  perguntas: Pergunta[]
  seguindo: (id: string) => boolean
  acompanham: (p: Pergunta) => number
  alternarSeguir: (id: string) => void
  criar: (texto: string, alvo: Alvo, autor: string) => string
}

export function usePerguntas(): PerguntasApi {
  const [criadas, setCriadas] = useState<Pergunta[]>(() => ler<Pergunta[]>(K_CRIADAS, []))
  const [seguidas, setSeguidas] = useState<string[]>(() => ler<string[]>(K_SEGUINDO, []))

  const perguntas = useMemo(() => [...[...criadas].reverse(), ...PERGUNTAS_SEED], [criadas])

  const seguindo = useCallback((id: string) => seguidas.includes(id), [seguidas])

  const acompanham = useCallback(
    (p: Pergunta) => p.acompanham + (seguidas.includes(p.id) ? 1 : 0),
    [seguidas]
  )

  const alternarSeguir = useCallback((id: string) => {
    setSeguidas((atual) => {
      const proximo = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
      gravar(K_SEGUINDO, proximo)
      return proximo
    })
  }, [])

  const criar = useCallback((texto: string, alvo: Alvo, autor: string) => {
    const agora = new Date()
    const vence = new Date(agora.getTime() + PRAZO_DIAS * 86400000)
    const limpo = texto.trim()
    const titulo = limpo.length > 90 ? `${limpo.slice(0, 87).trimEnd()}…` : limpo
    const id = `u-${agora.getTime()}`
    const nova: Pergunta = {
      id,
      titulo,
      texto: limpo.length > 90 ? limpo : undefined,
      autor,
      criadaEm: dataHora(agora),
      criadaEmIso: agora.toISOString(),
      alvo,
      respondida: false,
      dias: 0,
      vence: dataHora(vence).slice(0, 10),
      acompanham: 0,
      etapas: [
        { rotulo: 'Enviada', quando: dataHora(agora).replace(/\/\d{4}/, ''), estado: 'feito' },
        { rotulo: 'Encaminhada ao síndico pelo conselho fiscal', estado: 'atual' },
        { rotulo: 'Aguardando resposta do síndico', estado: 'pendente' },
        { rotulo: 'Resposta publicada', estado: 'pendente' }
      ]
    }
    setCriadas((atual) => {
      const proximo = [...atual, nova]
      gravar(K_CRIADAS, proximo)
      return proximo
    })
    // Quem pergunta passa a acompanhar a própria pergunta.
    setSeguidas((atual) => {
      const proximo = [...atual, id]
      gravar(K_SEGUINDO, proximo)
      return proximo
    })
    return id
  }, [])

  return { perguntas, seguindo, acompanham, alternarSeguir, criar }
}
