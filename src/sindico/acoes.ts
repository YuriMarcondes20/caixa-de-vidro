import { dataHora } from '../format'
import type { EstadoDecisao, Lancamento } from '../morador/dados'
import { mudar } from '../store'

/** Ações do síndico. Hoje gravam no navegador; com back-end viram chamadas à API. */

export function anexarComprovante(lancamentoId: string, comprovante: string): void {
  mudar((d) => ({ ...d, comprovantes: { ...d.comprovantes, [lancamentoId]: { comprovante: comprovante.trim() } } }))
}

export function publicarResposta(perguntaId: string, texto: string, dias: number): void {
  const quando = dataHora(new Date()).slice(0, 10)
  mudar((d) => ({ ...d, respostas: { ...d.respostas, [perguntaId]: { texto: texto.trim(), quando, dias } } }))
}

export function criarLancamento(l: Lancamento): void {
  mudar((d) => ({ ...d, extras: [...d.extras, l] }))
}

export function atualizarDecisao(decisaoId: string, estado: EstadoDecisao): void {
  const data = dataHora(new Date()).slice(0, 5)
  mudar((d) => ({ ...d, decisoes: { ...d.decisoes, [decisaoId]: { estado, data } } }))
}

/** "1.234,56" ou "1234.56" -> 1234.56. Devolve NaN se não for um número. */
export function lerValor(texto: string): number {
  const t = texto.replace(/[R$\s]/g, '')
  const normal = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t
  return Number(normal)
}
