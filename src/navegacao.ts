import { useCallback, useEffect, useRef, useState } from 'react'

/** Cada entrada do histórico do navegador guarda a pilha de telas inteira: voltar do celular restaura a tela anterior. */
interface EstadoHistorico<T> {
  papel: string
  pilha: T[]
  /** Quantas entradas foram empilhadas desde a abertura do app. */
  d: number
}

export interface Navegacao<T> {
  pilha: T[]
  topo: T
  ir: (t: T) => void
  voltar: () => void
  /** Troca de aba: zera a pilha (uma entrada nova no histórico; tocar na aba atual não faz nada). */
  trocarAba: (t: T) => void
  substituir: (t: T) => void
  /** Desfaz as entradas empilhadas e só então chama `aoSair`: o "voltar" do celular não fica "morto" na tela de entrada. */
  sair: (aoSair: () => void) => void
}

function salvo<T>(papel: string): EstadoHistorico<T> | null {
  const s = window.history.state as Partial<EstadoHistorico<T>> | null
  return s && s.papel === papel && Array.isArray(s.pilha) && s.pilha.length > 0 && typeof s.d === 'number'
    ? (s as EstadoHistorico<T>)
    : null
}

export function useNavegacao<T extends { nome: string }>(papel: string, inicio: T): Navegacao<T> {
  const [pilha, setPilha] = useState<T[]>(() => salvo<T>(papel)?.pilha ?? [inicio])
  const pilhaRef = useRef(pilha)
  const profundidade = useRef(salvo<T>(papel)?.d ?? 0)
  pilhaRef.current = pilha

  useEffect(() => {
    if (!salvo<T>(papel)) {
      window.history.replaceState({ papel, pilha: [inicio], d: 0 } satisfies EstadoHistorico<T>, '')
    }
    const aoVoltar = (e: PopStateEvent) => {
      const s = e.state as Partial<EstadoHistorico<T>> | null
      if (s && s.papel === papel && Array.isArray(s.pilha) && s.pilha.length > 0) {
        setPilha(s.pilha)
        profundidade.current = typeof s.d === 'number' ? s.d : 0
      }
    }
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [papel])

  const empurrar = useCallback(
    (nova: T[]) => {
      profundidade.current += 1
      window.history.pushState({ papel, pilha: nova, d: profundidade.current } satisfies EstadoHistorico<T>, '')
      setPilha(nova)
    },
    [papel]
  )

  const ir = useCallback((t: T) => empurrar([...pilhaRef.current, t]), [empurrar])

  const voltar = useCallback(() => {
    if (pilhaRef.current.length > 1) window.history.back()
  }, [])

  const trocarAba = useCallback(
    (t: T) => {
      const atual = pilhaRef.current
      if (atual.length === 1 && JSON.stringify(atual[0]) === JSON.stringify(t)) return
      empurrar([t])
    },
    [empurrar]
  )

  const substituir = useCallback(
    (t: T) => {
      const nova = [...pilhaRef.current.slice(0, -1), t]
      window.history.replaceState({ papel, pilha: nova, d: profundidade.current } satisfies EstadoHistorico<T>, '')
      setPilha(nova)
    },
    [papel]
  )

  const sair = useCallback((aoSair: () => void) => {
    const n = profundidade.current
    if (n <= 0) return aoSair()
    const depois = () => {
      window.removeEventListener('popstate', depois)
      aoSair()
    }
    window.addEventListener('popstate', depois)
    window.history.go(-n)
  }, [])

  return { pilha, topo: pilha[pilha.length - 1], ir, voltar, trocarAba, substituir, sair }
}
