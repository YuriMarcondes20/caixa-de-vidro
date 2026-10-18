import { useState } from 'react'
import { Marca } from './components/ui'
import Login from './Login'
import Morador from './Morador'
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

  if (!sessao) {
    return (
      <main className="page">
        <Login onEntrar={entrar} />
      </main>
    )
  }

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
      {sessao.papel === 'morador' ? <Morador /> : <Sindico />}
    </main>
  )
}
