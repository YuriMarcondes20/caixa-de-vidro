import { Ic, type NomeIcone } from '../components/ui'

export interface Aba {
  id: string
  rotulo: string
  icone: NomeIcone
}

export function BarraAbas({ abas, ativa, onAba }: { abas: Aba[]; ativa: string; onAba: (id: string) => void }) {
  return (
    <nav className="abas" aria-label="Navegação principal" style={{ gridTemplateColumns: `repeat(${abas.length}, minmax(0, 1fr))` }}>
      {abas.map((a) => (
        <button
          key={a.id}
          className="aba"
          aria-current={ativa === a.id ? 'page' : undefined}
          onClick={() => onAba(a.id)}
        >
          <Ic n={a.icone} size={24} sw={1.5} />
          {a.rotulo}
        </button>
      ))}
    </nav>
  )
}

/** Barra de ação flutuante (vidro) das telas de detalhe. */
export function BarraAcao({ children }: { children: React.ReactNode }) {
  return <div className="barra">{children}</div>
}

/** Sempre "Voltar": é a palavra que todo mundo reconhece. */
export function Voltar({ rotulo = 'Voltar', onClick }: { rotulo?: string; onClick: () => void }) {
  return (
    <button className="voltar" onClick={onClick}>
      <Ic n="voltar" size={24} />
      {rotulo}
    </button>
  )
}
