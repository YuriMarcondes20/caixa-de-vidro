import { useState } from 'react'
import { aplicarLetras, lerLetras, type Letras } from '../letras'

/** Botão "Tamanho das letras: Normal / Grande", igual para morador e síndico. */
export function ControleLetras() {
  const [letras, setLetras] = useState<Letras>(lerLetras)

  function escolher(l: Letras) {
    aplicarLetras(l)
    setLetras(l)
  }

  return (
    <section className="section letras" aria-labelledby="lt">
      <h2 className="heading" id="lt">
        Tamanho das letras
      </h2>
      <div className="seg" role="group" aria-labelledby="lt" style={{ marginTop: 'var(--space-3)' }}>
        <button aria-pressed={letras === 'normal'} onClick={() => escolher('normal')}>
          Normal
        </button>
        <button aria-pressed={letras === 'grande'} onClick={() => escolher('grande')}>
          Grande
        </button>
      </div>
    </section>
  )
}
