const CHAVE = 'caixa-de-vidro:letras'

export type Letras = 'normal' | 'grande'

export function lerLetras(): Letras {
  try {
    return localStorage.getItem(CHAVE) === 'grande' ? 'grande' : 'normal'
  } catch {
    return 'normal'
  }
}

/** Aplica o tamanho das letras na página inteira (classe no <html>) e guarda a escolha. */
export function aplicarLetras(l: Letras): void {
  document.documentElement.classList.toggle('grande', l === 'grande')
  try {
    localStorage.setItem(CHAVE, l)
  } catch {
    /* sem armazenamento: vale só nesta visita */
  }
}
