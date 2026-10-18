const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Real com sinal explícito. Menos tipográfico (U+2212), nunca hífen. */
export function moedaComSinal(valor: number): string {
  const sinal = valor < 0 ? '−' : '+'
  return `${sinal} ${brl.format(Math.abs(valor)).replace(/ /g, ' ')}`
}

/** Real sem sinal, para saldos. */
export function moeda(valor: number): string {
  return brl.format(valor).replace(/ /g, ' ')
}

/** yyyy-mm-dd -> dd/mm/yyyy */
export function dataBR(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
