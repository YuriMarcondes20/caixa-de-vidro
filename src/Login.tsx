import { useState, type FormEvent } from 'react'
import { Marca } from './components/ui'
import { ROTULO_PAPEL, type Papel, type Sessao } from './sessao'

function Campo(props: {
  id: string
  rotulo: string
  valor: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'numeric' | 'email'
  invalido?: boolean
}) {
  return (
    <div className="campo">
      <label className="rotulo" htmlFor={props.id}>
        {props.rotulo}
      </label>
      <input
        id={props.id}
        type={props.type ?? 'text'}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        value={props.valor}
        onChange={(e) => props.onChange(e.target.value)}
        aria-invalid={props.invalido || undefined}
      />
    </div>
  )
}

export default function Login({ onEntrar }: { onEntrar: (s: Sessao) => void }) {
  const [papel, setPapel] = useState<Papel>('morador')
  const [condominio, setCondominio] = useState('')
  const [bloco, setBloco] = useState('')
  const [apto, setApto] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (papel === 'morador') {
      const digitos = celular.replace(/\D/g, '')
      if (!condominio.trim() || !bloco.trim() || !apto.trim()) {
        setErro('Informe o código do condomínio, o bloco e o apartamento.')
        return
      }
      if (digitos.length < 10) {
        setErro('Informe o celular com DDD.')
        return
      }
      onEntrar({ papel, contato: celular.trim(), bloco: bloco.trim(), apto: apto.trim() })
      return
    }
    if (!email.includes('@') || !senha) {
      setErro('Informe um e-mail válido e a sua senha.')
      return
    }
    onEntrar({ papel, contato: email.trim() })
  }

  function trocar(p: Papel) {
    setPapel(p)
    setErro('')
  }

  return (
    <main className="page entrada">
      <div className="entrada-topo">
        <Marca tamanho={56} nome={false} />
        <h1 className="display">Caixa de Vidro</h1>
        <p className="corpo muted">As contas do condomínio, à vista.</p>
      </div>

      <form className="painel login-card" onSubmit={enviar} noValidate>
        <div className="papeis" role="radiogroup" aria-label="Você é">
          {(['morador', 'sindico'] as Papel[]).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={papel === p}
              className="chip"
              onClick={() => trocar(p)}
            >
              {ROTULO_PAPEL[p]}
            </button>
          ))}
        </div>

        {papel === 'morador' ? (
          <>
            <Campo id="cond" rotulo="Código do condomínio" valor={condominio} onChange={setCondominio} placeholder="Recebido do conselho fiscal" />
            <div className="dupla">
              <Campo id="bloco" rotulo="Bloco" valor={bloco} onChange={setBloco} placeholder="7" />
              <Campo id="apto" rotulo="Apartamento" valor={apto} onChange={setApto} placeholder="32" />
            </div>
            <Campo id="cel" rotulo="Celular" valor={celular} onChange={setCelular} placeholder="(16) 9 0000-0000" type="tel" inputMode="tel" autoComplete="tel" />
          </>
        ) : (
          <>
            <Campo id="email" rotulo="E-mail" valor={email} onChange={setEmail} type="email" inputMode="email" autoComplete="email" />
            <Campo id="senha" rotulo="Senha" valor={senha} onChange={setSenha} type="password" autoComplete="current-password" />
          </>
        )}

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        <button className="btn primary" type="submit">
          Entrar
        </button>
        <p className="caption">
          {papel === 'morador'
            ? 'O conselho fiscal confere se a unidade está na lista de moradores. Seu nome e apartamento não aparecem para outros moradores.'
            : 'Acesso do síndico: responda as perguntas dos moradores, lance contas e anexe comprovantes.'}
        </p>
        <p className="caption demo">Versão de demonstração: nenhum SMS é enviado e qualquer dado preenchido entra.</p>
      </form>

      <p className="caption rodape-entrada">Ainda sem código? Peça ao conselho fiscal do seu condomínio.</p>
    </main>
  )
}
