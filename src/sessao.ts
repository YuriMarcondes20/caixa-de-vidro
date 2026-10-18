export type Papel = 'morador' | 'sindico'

export interface Sessao {
  papel: Papel
  /** Morador: celular. Síndico: e-mail. */
  contato: string
  bloco?: string
  apto?: string
}

export const ROTULO_PAPEL: Record<Papel, string> = {
  morador: 'Morador',
  sindico: 'Síndico'
}

const CHAVE = 'caixa-de-vidro:sessao'

export function lerSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return null
    const s = JSON.parse(bruto)
    return (s.papel === 'morador' || s.papel === 'sindico') && typeof s.contato === 'string' ? s : null
  } catch {
    return null
  }
}

export function salvarSessao(s: Sessao | null): void {
  try {
    if (s) localStorage.setItem(CHAVE, JSON.stringify(s))
    else localStorage.removeItem(CHAVE)
  } catch {
    /* sem armazenamento: a sessão vale só até recarregar */
  }
}
