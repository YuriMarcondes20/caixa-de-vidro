import { useSyncExternalStore } from 'react'
import type { EstadoDecisao, Lancamento } from './morador/dados'

/**
 * O que o síndico faz e o morador enxerga. Fica no navegador (localStorage): serve para a demonstração.
 * Com um back-end, estas mesmas ações viram chamadas à API.
 */
export interface Dados {
  /** Lançamentos criados pelo síndico. */
  extras: Lancamento[]
  /** Comprovantes anexados a lançamentos que estavam sem comprovante. */
  comprovantes: Record<string, { comprovante: string }>
  /** Respostas publicadas pelo síndico. `dias` = quantos dias levou para responder. */
  respostas: Record<string, { texto: string; quando: string; dias: number }>
  /** Andamento das decisões atualizado pelo síndico. `data` = dd/mm da mudança. */
  decisoes: Record<string, { estado: EstadoDecisao; data: string }>
}

const CHAVE = 'caixa-de-vidro:dados'
const VAZIO: Dados = { extras: [], comprovantes: {}, respostas: {}, decisoes: {} }

function ler(): Dados {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? { ...VAZIO, ...(JSON.parse(bruto) as Partial<Dados>) } : VAZIO
  } catch {
    return VAZIO
  }
}

let atual: Dados = ler()
let versao = 0
const ouvintes = new Set<() => void>()

function avisar() {
  versao += 1
  ouvintes.forEach((f) => f())
}

export function dados(): Dados {
  return atual
}

export function mudar(fn: (d: Dados) => Dados): void {
  atual = fn(atual)
  try {
    localStorage.setItem(CHAVE, JSON.stringify(atual))
  } catch {
    /* sem armazenamento: vale só nesta sessão */
  }
  avisar()
}

// Outra aba do navegador mudou os dados: recarrega.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CHAVE) {
      atual = ler()
      avisar()
    }
  })
}

function assinar(f: () => void) {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}

/** Faz o componente atualizar quando os dados mudam. */
export function useDados(): Dados {
  useSyncExternalStore(assinar, () => versao)
  return atual
}
