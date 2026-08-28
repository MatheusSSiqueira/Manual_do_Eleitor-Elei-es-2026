# Manual do Eleitor — Eleições 2026

Página web estática pensada para acessibilidade e leitura rápida.

## Arquivos

- `index.html` — versão modular.
- `styles.css` — estilos responsivos, alto contraste e modo escuro.
- `script.js` — busca, preferências e leitura por áudio via Web Speech API.
- `manual_eleitor_2026.html` — versão **autônoma**, com CSS e JavaScript embutidos; pode ser aberta diretamente no navegador.
- `manual.md` — conteúdo-fonte em Markdown.

## Funcionalidades

- Layout responsivo para desktop, tablet e celular.
- Busca por todo o manual, agora suspensa e integrada diretamente ao cabeçalho.
- Leitura por áudio por seção, com play, pausa, continuar, anterior, próxima, velocidade ajustável e normalização de texto (lê anos e datas corretamente).
- Modo escuro e Alto contraste.
- Aumento de fonte.
- Atalho de teclado `/` para a busca.
- Skip link para leitores de tela.
- Conteúdo visível mesmo com JavaScript desativado.
- Links oficiais consolidados no final do manual.

## Observações e Dependências

- **Ícones:** O projeto utiliza a biblioteca FontAwesome via CDN para renderizar os ícones visuais da interface.
- **Áudio:** A leitura por áudio usa a funcionalidade nativa `SpeechSynthesis` do navegador/sistema. A disponibilidade das vozes em português depende do ambiente do usuário.

## Deploy

Este repositório foi arquitetado como uma aplicação *client-side* estática (HTML, CSS e JavaScript puros), configurada para implantação direta via **GitHub Pages**. Nenhuma etapa de *build* ou configuração de servidor backend é necessária.

## Licença

Este projeto possui fins educacionais e está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.