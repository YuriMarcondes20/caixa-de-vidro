import { useState, type FormEvent } from 'react'
import { Marca } from './components/ui'
import { ROTULO_PAPEL, type Papel, type Sessao } from './sessao'

export default function Login({ onEntrar }: { onEntrar: (s: Sessao) => void }) {
  const [papel, setPapel] = useState<Papel>('morador')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@') || !senha) {
      setErro('Informe um e-mail válido e a sua senha.')
      return
    }
    onEntrar({ papel, email: email.trim() })
  }

  return (
    <div className="login">
      <Marca />
      <h1 className="display">Tudo à vista.</h1>
      <p className="page-sub">Entre para ver as contas do seu condomínio, cada número com a sua origem.</p>

      <form className="painel login-card" onSubmit={enviar} noValidate>
        <div className="papeis" role="radiogroup" aria-label="Você é">
          {(['morador', 'sindico'] as Papel[]).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={papel === p}
              className="chip"
              onClick={() => setPapel(p)}
            >
              {ROTULO_PAPEL[p]}
            </button>
          ))}
        </div>

        <label className="campo">
          <span className="k">E-mail</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!erro}
          />
        </label>
        <label className="campo">
          <span className="k">Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            aria-invalid={!!erro}
          />
        </label>

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        <button className="btn primary" type="submit">
          Entrar
        </button>
        <p className="caption">Versão de demonstração: qualquer e-mail e senha entram.</p>
      </form>
    </div>
  )
}
