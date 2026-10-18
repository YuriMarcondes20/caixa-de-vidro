const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const pct = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Real com sinal explícito. Menos tipográfico (U+2212), nunca hífen. */
export function moedaComSinal(valor: number): string {
  const sinal = valor < 0 ? '−' : '+'
  return `${sinal} ${brl.format(Math.abs(valor)).replace(/ /g, ' ')}`
}

/** Real sem sinal, para saldos e totais. */
export function moeda(valor: number): string {
  return brl.format(valor).replace(/ /g, ' ')
}

/** 4,2% */
export function percentual(valor: number): string {
  return `${pct.format(valor)}%`
}

/** yyyy-mm-dd -> dd/mm/yyyy */
export function dataBR(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${a}`
}

/** yyyy-mm-dd -> dd/mm */
export function dataCurta(iso: string): string {
  return dataBR(iso).slice(0, 5)
}

/** Date -> "14/10/2026, 09:20" */
export function dataHora(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`
}
