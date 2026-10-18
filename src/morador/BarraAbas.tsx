import { Ic } from '../components/ui'
import { ABAS, ROTULO_TELA, type NomeAba } from './tipos'

export function BarraAbas({ ativa, onAba }: { ativa: NomeAba; onAba: (n: NomeAba) => void }) {
  return (
    <nav className="abas" aria-label="Navegação principal">
      {ABAS.map((n) => (
        <button
          key={n}
          className="aba"
          aria-current={ativa === n ? 'page' : undefined}
          onClick={() => onAba(n)}
        >
          <Ic n={n} size={22} sw={1.5} />
          {ROTULO_TELA[n]}
        </button>
      ))}
    </nav>
  )
}

/** Barra de ação flutuante (vidro) das telas de detalhe. */
export function BarraAcao({ children }: { children: React.ReactNode }) {
  return <div className="barra">{children}</div>
}

export function Voltar({ rotulo, onClick }: { rotulo: string; onClick: () => void }) {
  return (
    <button className="voltar" onClick={onClick}>
      <Ic n="voltar" size={20} />
      {rotulo}
    </button>
  )
}
