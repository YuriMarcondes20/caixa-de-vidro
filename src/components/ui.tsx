import type { ReactNode } from 'react'
import type { Estado } from '../data'

export function Marca() {
  return (
    <span className="marca">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect className="box" x="4" y="4" width="56" height="56" rx="16" />
        <rect className="pane" x="20" y="20" width="32" height="32" rx="6" />
      </svg>
      <span className="word">caixa de vidro</span>
    </span>
  )
}

const ICONES: Record<Estado, ReactNode> = {
  com: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  aguardando: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  sem: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
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

export function Icone({ estado }: { estado: Estado }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {ICONES[estado]}
    </svg>
  )
}

/** Selo de estado: sempre palavra + ícone, nunca só cor. */
export function Status({ estado }: { estado: Estado }) {
  return (
    <span className={`pill ${CLASSE_ESTADO[estado]}`}>
      <Icone estado={estado} />
      {ROTULO_ESTADO[estado]}
    </span>
  )
}

export function IconeDocumento() {
  return (
    <svg className="icon lg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  )
}
