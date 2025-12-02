# 🤖 Competente

Bot oficial do **COMPET** para automações no Discord.  
---

## 📑 Índice

- [📦 Pré-requisitos](#-pré-requisitos)
- [⚙️ Getting Started](#️-getting-started)
- [🖥️ Executando Localmente](#️-executando-localmente)
- [🔑 Variáveis de Ambiente](#-variáveis-de-ambiente-env)
- [☁️ Google API](#️-google-api)
- [📡 API do Competente](#-api-do-competente)


---

## 📦 Pré-requisitos

Para rodar o bot, você precisa ter instalado:

| Tecnologia | Instalação |
|------------|------------|
| **Node.js** (>= 18.x) | [nodejs.org/en/download](https://nodejs.org/en/download) |
| **Python** | [python.org/downloads](https://www.python.org/downloads/) |


## ⚙️ Getting Started

### 1. Configure o bot no Discord
1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications).  
2. Crie uma aplicação (`New Application`) caso ainda não tenha o **Competente**.  
3. Vá em **OAuth2 → URL Generator** e configure conforme a imagem:  

<p align="center">
  <img src="images/bot_url.png?raw=true" width="100%">
</p>

4. Copie o link em **Generated URL** e cole no navegador para convidar o bot.  
   > Você precisa ser **Administrador** do servidor.

---

### 2. Configure variáveis de ambiente
- Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`.  
- Mais detalhes em [Variáveis de Ambiente](#-variáveis-de-ambiente-env).

---

### 3. Configure a Google API
- Edite o arquivo:
```
src/bot/utils/googleAPT/competente.development.example.json
```

- Mais detalhes em [Google API](#️-google-api).

## 🖥️ Executando Localmente

Abra **dois terminais** e rode:

```bash
# API
npm run api:dev
```
```bash
# Bot
npm run bot:dev
```

---

## 🔑 Variáveis de Ambiente (.env)

> Variáveis marcadas com [*] são únicas e devem ser guardadas com segurança.

| Variável | Como obter |
|----------|------------|
| **DISCORD_GUILD_ID** | Clique com botão direito no servidor → **Copiar ID** (habilite *Modo Desenvolvedor*). |
| **DISCORD_PUBLIC_KEY** | Developer Portal → *Applications → Competente → General Information → PUBLIC KEY*. |
| **DISCORD_CLIENT_ID** | Developer Portal → *Applications → Competente → OAuth2 → CLIENT ID*. |
| **DISCORD_TOKEN** [*] | Developer Portal → *Applications → Competente → Bot → TOKEN*. |
| **ENVIRONMENT** | `development` ou `production`. |
| **GOOGLE_FORM_ID** | Extraído da URL do Google Forms: `.../d/e/{GOOGLE_FORM_ID}/viewform`. |
| **AUTENTIQUE_TOKEN** [*] | No [Autentique](https://docs.autentique.com.br/api/), em *Chaves de API*. |
| **AUTENTIQUE_URL** | Endpoint padrão: `https://api.autentique.com.br/v2/graphql`. |
| **HOST** | Exemplo: `http://localhost:3000/`. |
| **MONGODB_USER** | Usuário do MongoDB. |
| **MONGODB_PASSWORD** | Senha do MongoDB. |

## ☁️ Google API

1. Acesse o [Google Cloud Console](https://cloud.google.com/cloud-console?hl=pt-br).  
2. Vá em **APIs e Serviços → Credenciais → Contas de Serviço → Chaves**.  
3. Gere uma nova chave JSON e salve como:  
```
competente.development.json
```
## 📡 API do Competente

A API serve para operações internas do COMPET (cadastro de membros, relatórios, certificados etc).  

### Endpoints disponíveis:

| Comando | Descrição |
|---------|-----------|
| `/add-to-compet` | Adiciona um novo competiano. |
| `/advertir` | Adverte um membro. |
| `/certificado-conclusao` | Gera certificado de conclusão. |
| `/close-talks` | Finaliza um Talks. |
| `/compet-em-numeros` | Lista dados do COMPET. |
| `/create` | Adiciona um novo competiano. |
| `/criar-talks` | Cria um Talks. |
| `/get-talks-info` | Retorna informações de um Talks. |
| `/help` | Explica comandos. |
| `/new-talks-forms` | Altera título do formulário de Talks. |
| `/quit-member` | Anuncia saída de membro. |
| `/registrar-talks` | Registra certificados assinados do Talks. |
| `/relatorio` | Envia relatório semanal para a planilha. |
| `/remove-from-compet` | Remove um membro. |
| `/talks-certificate` | Emite certificados de um Talks. |

