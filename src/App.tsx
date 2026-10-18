import { useState } from 'react'
import { Marca } from './components/ui'
import Login from './Login'
import Morador from './morador/Morador'
import Sindico from './Sindico'
import { lerSessao, ROTULO_PAPEL, salvarSessao, type Sessao } from './sessao'

export default function App() {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessao)

  function entrar(s: Sessao) {
    salvarSessao(s)
    setSessao(s)
  }
  function sair() {
    salvarSessao(null)
    setSessao(null)
  }

  if (!sessao) return <Login onEntrar={entrar} />

  if (sessao.papel === 'morador') return <Morador sessao={sessao} onSair={sair} />

  return (
    <main className="page">
      <header className="topbar">
        <Marca />
        <div className="quem">
          <span className="caption">{ROTULO_PAPEL[sessao.papel]}</span>
          <button className="btn text" onClick={sair}>
            Sair
          </button>
        </div>
      </header>
      <Sindico />
    </main>
  )
}
