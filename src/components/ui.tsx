import type { ReactNode } from 'react'
import type { Estado } from '../morador/dados'

export function Marca({ tamanho = 28, nome = true }: { tamanho?: number; nome?: boolean }) {
  return (
    <span className="marca">
      <svg viewBox="0 0 64 64" aria-hidden="true" style={{ width: tamanho, height: tamanho }}>
        <rect className="box" x="4" y="4" width="56" height="56" rx="16" />
        <rect className="pane" x="20" y="20" width="32" height="32" rx="6" />
      </svg>
      {nome && <span className="word">caixa de vidro</span>}
    </span>
  )
}

const CIRCULO = 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z'

const ICONES = {
  inicio: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  lancamentos: 'M6 3h12v18l-3-2-3 2-3-2-3 2z|M9 8h6M9 12h6',
  orcamento: 'M3 21h18M6 17v-6M11 17V6M16 17v-4M20 17V9',
  decisoes: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z|M14 3v5h5M9 14l2 2 4-4',
  perguntas: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  voltar: 'm15 18-6-6 6-6',
  avancar: 'm9 6 6 6-6 6',
  mais: 'M12 5v14M5 12h14',
  busca: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z|m20 20-3.5-3.5',
  documento: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z|M14 3v5h5',
  info: `${CIRCULO}|M12 11v5M12 8h.01`,
  ok: `${CIRCULO}|m8 12 3 3 5-6`,
  espera: `${CIRCULO}|M12 7v5l3 2`,
  erro: `${CIRCULO}|m9 9 6 6M15 9l-6 6`,
  andamento: `${CIRCULO}|M12 7v5h4`,
  neutro: CIRCULO,
  marcar: 'm5 12 5 5 9-10',
  pessoas:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8z|M22 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75'
} as const

export type NomeIcone = keyof typeof ICONES

export function Ic({ n, size = 16, sw = 1.75 }: { n: NomeIcone; size?: number; sw?: number }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: size, height: size, strokeWidth: sw }}
    >
      {ICONES[n].split('|').map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

export const ROTULO_ESTADO: Record<Estado, string> = {
  com: 'Com comprovante',
  aguardando: 'Aguardando comprovante',
  sem: 'Sem comprovante'
}

export const CLASSE_ESTADO: Record<Estado, string> = {
  com: 'ok',
  aguardando: 'warn',
  sem: 'crit'
}

const ICONE_ESTADO: Record<Estado, NomeIcone> = { com: 'ok', aguardando: 'espera', sem: 'erro' }

export function IconeEstado({ estado, size = 16 }: { estado: Estado; size?: number }) {
  return <Ic n={ICONE_ESTADO[estado]} size={size} />
}

/** Selo de estado: sempre palavra + ícone, nunca só cor. */
export function Status({ estado, rotulo }: { estado: Estado; rotulo?: string }) {
  return (
    <span className={`pill ${CLASSE_ESTADO[estado]}`}>
      <IconeEstado estado={estado} />
      {rotulo ?? ROTULO_ESTADO[estado]}
    </span>
  )
}

/**
 * Vidro com algo para refratar. Os blocos de cor ficam só nos cantos, dentro do
 * padding do painel: decoração nunca passa por baixo de texto.
 */
export function Hero({ children, espelhado = false }: { children: ReactNode; espelhado?: boolean }) {
  return (
    <div className={`hero ${espelhado ? 'espelhado' : ''}`}>
      <div className="blob b1" />
      <div className="blob b2" />
      {children}
    </div>
  )
}
