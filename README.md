# Manual do Eleitor — Eleições 2026

Página web estática pensada para acessibilidade e leitura rápida.

![CI Status](https://github.com/matheusssiqueira/manual-eleitor-2026/actions/workflows/ci.yml/badge.svg)

## 📌 Status do Projeto
- 🟢 **Online:** Publicado via GitHub Pages.
- 🟢 **CI/CD:** Pipeline de validação automatizada implementado (HTML, CSS e JS).
- 🟢 **Acessibilidade:** Suporte a Web Speech API, Alto Contraste e navegação por teclado.

## 📅 Histórico de Atualizações
- **04/09/2026:** Implementação de Integração Contínua (CI) via GitHub Actions, Focus Trap para navegação por teclado no menu mobile e refinação do leitor de áudio para siglas e frações.
- **28/08/2026:** Lançamento da versão inicial responsiva com Web Speech API, busca dinâmica em tempo real e ajustes de Alto Contraste.

## 📁 Arquitetura e Arquivos
A aplicação foi desenvolvida sem frameworks complexos, focando em performance e manipulação direta do DOM (Vanilla JS).
- `index.html` — Estrutura semântica principal.
- `styles.css` — Estilização responsiva, regras de impressão (`@media print`) e variáveis de tema.
- `script.js` — Lógica isolada de interatividade, persistência de dados (`localStorage`) e leitura avançada de áudio.
- `manual.md` — Arquivo-fonte em Markdown preservado para controle de versão de texto bruto.

## ⚙️ Funcionalidades
- **Busca Suspensa em Tempo Real:** Filtro instantâneo integrado ao cabeçalho que varre o DOM sem recarregar a página.
- **Leitura por Áudio Inteligente:** Algoritmo de sanitização em JavaScript (RegEx) para narrar datas, frações, siglas e anos de forma natural em PT-BR.
- **Acessibilidade Visual e Motora:** Modo escuro, Alto Contraste, ajuste dinâmico de tipografia e "Focus Trap" para navegação exclusiva via teclado.
- **Responsividade Total:** Layout adaptável (CSS Grid/Flexbox) com barra lateral retrátil (off-canvas).
- **Proteção de Execução:** Script encapsulado em `DOMContentLoaded` com uso de *optional chaining* (`?.`) para prevenção de falhas.

## 🚀 CI/CD e Deploy
O repositório utiliza **GitHub Actions** para Integração Contínua (CI). A cada push ou pull request, um fluxo de trabalho valida a sintaxe do código e a integridade estrutural. O Continuous Deployment (CD) é feito de forma automatizada pelo **GitHub Pages**.

## ⚖️ Licença
Projeto de código aberto com fins educacionais, desenvolvido como parte da graduação em Análise e Desenvolvimento de Sistemas (Unicesumar). Licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.