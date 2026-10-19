# Caixa de Vidro

App web (mobile-first) de prestação de contas de condomínio: o morador vê as contas como elas são, com a origem de cada número.

> **Versão de demonstração.** O login é falso (qualquer dado entra, nenhum SMS é enviado) e todos os dados são fictícios.

## Telas do morador

Entrada, Início, Lançamentos (com detalhe), Orçamento × realizado, Decisões (com detalhe) e Perguntas (com nova pergunta e detalhe).
Perguntas criadas e perguntas acompanhadas ficam salvas no navegador (`localStorage`).

## Telas do síndico

Painel (o que está esperando por ele), Contas do mês (conferir lançamentos e anexar comprovantes), Novo lançamento, Perguntas dos moradores (responder), Decisões (atualizar o andamento).
Tudo o que o síndico faz aparece para o morador: resposta publicada, lançamento novo, comprovante anexado e andamento da decisão.

> Na demonstração esses dados ficam no navegador de quem está usando (localStorage). O síndico e o morador só enxergam o que o outro fez se usarem o **mesmo navegador**. Para funcionar entre aparelhos diferentes é preciso um back-end.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build de produção
```

React + Vite + TypeScript. O visual segue o design system "Caixa de Vidro" (tokens em `src/styles.css`).
