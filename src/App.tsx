import { useState } from 'react'
import Login from './Login'
import Morador from './morador/Morador'
import Sindico from './sindico/Sindico'
import { lerSessao, salvarSessao, type Sessao } from './sessao'

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
  return sessao.papel === 'morador' ? <Morador sessao={sessao} onSair={sair} /> : <Sindico onSair={sair} />
}
