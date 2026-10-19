import { ControleLetras } from '../../components/ControleLetras'
import { Hero, Ic } from '../../components/ui'
import { moeda } from '../../format'
import { CONDOMINIO, PRAZO_DIAS, RESUMO, diasDecorridos, listaDecisoes, lancamentosDoMes } from '../../morador/dados'
import type { PropsS } from '../tipos'

export default function Inicio({ nav, p, onSair }: PropsS & { onSair: () => void }) {
  const mes = lancamentosDoMes()
  const sem = mes.filter((l) => l.estado === 'sem')
  const aguardando = mes.filter((l) => l.estado === 'aguardando')
  const somaSem = sem.reduce((s, l) => s + Math.abs(l.valor), 0)
  const abertas = p.perguntas.filter((q) => !q.respondida)
  const maisAntiga = Math.max(0, ...abertas.map(diasDecorridos))
  const emAndamento = listaDecisoes().filter((d) => d.estado === 'execucao').length

  return (
    <main className="page com-abas">
      <header className="cab">
        <div className="cab-linha">
          <span className="caption">{CONDOMINIO}</span>
          <button className="btn text" onClick={onSair}>
            Sair
          </button>
        </div>
        <h1 className="page-title">Painel do síndico</h1>
        <p className="ajuda">Aqui você vê o que está esperando por você: perguntas dos moradores e comprovantes que faltam.</p>
      </header>

      <Hero>
        <section className="painel" aria-label="Perguntas para responder">
          <p className="k">Perguntas dos moradores para responder</p>
          <p className="figure">{abertas.length}</p>
          <p className="caption">
            {abertas.length === 0
              ? 'Nenhuma pergunta esperando resposta. Bom trabalho!'
              : `A mais antiga espera há ${maisAntiga} ${maisAntiga === 1 ? 'dia' : 'dias'}. O prazo é de ${PRAZO_DIAS} dias e o atraso fica visível para todos.`}
          </p>
          {abertas.length > 0 && (
            <button className="btn primary" style={{ marginTop: 'var(--space-4)', width: '100%' }} onClick={() => nav.aba('perguntas')}>
              Responder perguntas
            </button>
          )}
        </section>
      </Hero>

      <div className="grade2">
        <button className="stat link" onClick={() => nav.aba('contas', 'sem')}>
          <p className="caption">Gastos sem comprovante</p>
          <p className="num" style={{ color: sem.length > 0 ? 'var(--critico)' : undefined }}>
            {sem.length}
          </p>
          <p className="dica">{sem.length > 0 ? `Soma ${moeda(somaSem)}` : 'Tudo em dia'}</p>
        </button>
        <button className="stat link" onClick={() => nav.aba('contas', 'aguardando')}>
          <p className="caption">Aguardando comprovante</p>
          <p className="num" style={{ color: aguardando.length > 0 ? 'var(--atencao)' : undefined }}>
            {aguardando.length}
          </p>
          <p className="dica">Toque para anexar</p>
        </button>
        <button className="stat link" onClick={() => nav.aba('decisoes')}>
          <p className="caption">Decisões em andamento</p>
          <p className="num">{emAndamento}</p>
          <p className="dica">Toque para atualizar</p>
        </button>
        <div className="stat">
          <p className="caption">Dinheiro em conta</p>
          <p className="num">{moeda(RESUMO.saldoFinal)}</p>
          <p className="dica">Balancete de setembro</p>
        </div>
      </div>

      <section className="section" aria-labelledby="fazer">
        <h2 className="heading" id="fazer">
          O que você quer fazer?
        </h2>
        <button className="cartao-link" onClick={() => nav.ir({ nome: 'novo-lancamento' })}>
          <Ic n="mais" size={24} sw={1.5} />
          <span className="ponto-t">Lançar um gasto ou uma entrada</span>
          <Ic n="avancar" size={20} />
        </button>
        <button className="cartao-link" onClick={() => nav.aba('contas')}>
          <Ic n="lancamentos" size={24} sw={1.5} />
          <span className="ponto-t">Conferir as contas do mês e anexar comprovantes</span>
          <Ic n="avancar" size={20} />
        </button>
      </section>

      <ControleLetras />
    </main>
  )
}
