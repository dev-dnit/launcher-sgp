# SGP Launcher (CLI)

Script de linha de comando para automatizar a execução e atualização da aplicação SGP.

## Funcionalidades

- Verificação e download da versão mais recente do SGP.
- Encerramento do processo antigo antes de iniciar o novo.
- Injeção de variáveis de ambiente a partir dum arquivo de configuração remoto.
- Inicialização dum novo SGP

## Pré-requisitos

- [Node.js](https://nodejs.org/ ) (versão 18 ou superior) instalado.

## Instalação e Configuração

1. Clone este repositório ou baixe os arquivos `launcher.js` e `package.json`.
2. Na pasta do projeto, crie um arquivo chamado `.env`.
3. Adicione as variáveis ao arquivo `.env`.
4. Abra um terminal na pasta do projeto e rode `npm install` para baixar as dependências.

## Como Usar

Para executar o launcher, simplesmente rode o comando no terminal:

```bash
npm run start
