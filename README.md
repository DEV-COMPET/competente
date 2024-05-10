# Competente

Para adicionar o competente no seu servidor do discord, basta clicar neste [link](https://discord.com/api/oauth2/authorize?client_id=1054755402346143816&permissions=8&scope=bot). (NÃO FUNCIONA MAIS)

# Como executar

1. Seu programa deve atender aos [Pré Requisitos](#pré-requisitos) da aplicação.
2. Depois congifurar o [Getting Started](#getting-started).
3. Com isso voce pode executar a sua aplicação localmente, seguindo o [Running Locally](#running-locally)

## Pré Requisitos

- Para executar o bot completamente, é necessário ter instalado em sua máquina:

<div align="center">
  <table>
    <tr>
      <th>Tecnologia</th>
      <th>Instalação</th>
    </tr>
    <tr>
      <td>node</td>
      <td><a href="https://nodejs.org/en/download">nodejs.org/en/download</a></td>
    </tr>
    <tr>
      <td>python</td>
      <td><a href="https://www.python.org/downloads/">python.org/downloads/</a></td>
    </tr>
  </table>
</div>


## Getting Started

- Primeiramente, instale as dependências necessárias

```
npm i
```

- Para rodar o bot em sua máquina e adicioná-lo ao seu servidor, siga esses passos:

### Adicione o Bot Base

- Acesse o site discord developers pelo [link](https://discord.com/developers/applications). Caso você não tenha o competente adicionado, adicione-o clocando em <b>*New Application*</b>.

- Estando dentro do Competente siga o caminho *OAuth2* -> *URL Generator*. Segue as configurações nas abas internas:

<p align="center">
  <img src="images/bot_url.png?raw=true" width="100%" height="100%">
</p>


- Em seguida copie o link que aparecerá na aba <b>*Generated URL*</b> e cole em um navegador. Esse link convidará o bot para seu servidor. 
- OBS: você deve ter permisão de administrador para adicioná-lo ao servidor e, futuramente, utilizá-lo.

### Clone Repository

- Clone o repositório em sua máquina

```
$ git clone git@github.com:DEV-COMPET/competente.git
```

### Configure variáveis ambiente

- crie um arquivo, na pasta raiz do projeto, nomeado .env, o qual possua a mesma estrutura do .env.example
- para um detalhamento mais aprofundado das variáveis ambiente, vá para a seção [env](#env)

### Configure a Google API

- o arquivo a ser modificado está situado em :
```
src/bot/utils/googleAPT/competente.development.example.json
```
- para uma explicação mais detalhada, vá para a seção [google API](#googleAPI)

## Running Locally

- Abra dois terminais em sua máquina.
- No primeiro execute:
```
$ npm run api:dev
```
- no segundo execute dois comandos:
- ative o ambiente virtual do python.

#### Windows
```
.\src\bot\utils\python\venv\Scripts\activate
```

#### Linux
```
source src/bot/utils/python/venv/bin/activate
```

- e coloque o bot no ar:

```
$ npm run bot:dev
```

## env

- Nota: toas as variaveis ambiente com [*] são únicas e, portanto, devem ser guardadas com segurança assim que forem geradas inicialmente. Caso contrário, será necessário gerar uma nova chave.

### **DISCORD_GUILD_ID**

- Com o bot adicionado, clique no seu servidor e clique com o botão direito em cima do nome do servidor e cloque em "Copiar ID do Servidor". 
- Caso essa opção não apareça para você, será necessário que você habilite a opção de desenvolvedor da sua conta do discord. Para  isso, siga esse caminho: *Configurações de Usuário* -> *Avançado* -> *Modo de Desenvolvedor* e habilite-o. Agora será possível copiar o ID do servidor, como mostrado no passo anterior. 
- Com o ID copiado, cole-o na aba de DISCORD_GUILD_ID.

### **DISCORD_PUBLIC_KEY**

- Disponível no site discord [discord developers](https://discord.com/developers/applications).
- Siga o caminho: *Applications* -> *Competente* -> *General Information* -> *PUBLIC KEY*.
- Essa é a chave que deverá ser colada em DISCORD_PUBLIC_KEY.

### **DISCORD_CLIENT_ID**

- Disponível no site discord [discord developers](https://discord.com/developers/applications).
- Siga o caminho: *Applications* -> *Competente* -> *OAuth2* -> *CLIENT ID*.
- Essa é a chave que deverá ser colada em DISCORD_CLIENT_ID.

### **DISCORD_TOKEN** [*]

- Disponível no site discord [discord developers](https://discord.com/developers/applications).
- Siga o caminho: *Applications* -> *Competente* -> *Bot* -> *TOKEN*.
- Essa é a chave que deverá ser colada em DISCORD_TOKEN.

### **ENVIRONMENT**

- Depende de qual ambiente você está desenvolvendo: development ou production. Seja qual for, copiar como foi mostrado e colar dessa maneira.

### **GOOGLE_FORM_ID**

- Obtido ao ser extraído de https://docs.google.com/forms/d/e/*{GOOGLE_FORM_ID}*/viewform do forms a ser alterado pelo bot.

### **AUTENTIQUE_TOKEN**

- Acesse o site da [api do Autentique](https://docs.autentique.com.br/api/), clicar em <b>*Chaves de API*</b>, logar na conta responsável pelo autentique, nesse caso a conta do COMPET, e copiar o token que aparecerá na tela.

### **AUTENTIQUE_URL**

- Acesse o site da [api do Autentique](https://docs.autentique.com.br/api/), e usar o link dito como <b>*endpoint*</b>.
- Até o momento da confecção dessa documentação, este é, por padrão, https://api.autentique.com.br/v2/graphql.
- OBS: este link pode mudar dependendo da versão atual da API, portanto vale a pena consultar o site da API para checar.

### **HOST**

- Host local no qual será executado o script.
- Geralmente na forma de <b>*http://localhost:3000/*</b>

### **MONGODB_USER**

- Usuário do MongoDB.

### **MONGODB_PASSWORD**

- Senha referente ao usuário do MongoDB.

## googleAPI

- para baixar o secret, acesse o [cloud](https://cloud.google.com/cloud-console?hl=pt-br) da google. Estando nele, clique em *Console*, estando na conta da google correta.
- Com o projeto aberto, siga o caminho: *APIs e serviços* -> *Credenciais* -> Conta em *Contas de Serviço* -> *Chaves*. Caso não consiga gerar nunhuma das chaves cadastradas, adicione uma nova chave. Você pode revogar qualquer chave ja existente quando quiser.
- Ela gera um arquivo, que deve ser salvo como ```competente.development.json```.

## API
A ideia é construir uma api baseada nas demandas que o próprio compet pode vir a necessitar ou mesmo que já necessita atualmente, como por exemplo o cadastro de novos membros, ou a saida de um membro. Tornar o membro scrum de uma equipe ou participante de intercâmbio. As rotas da api serão rotas em geral restritas apenas a membros do compet com autorização para tal, Tutores scrums e devs, com isso em mente, para fins de documentação, aqui estão listadas os ENDPOINTS disponíveis para acesso atualmente:

Endpoint|Metódo|Descrição|Autorização
:---:|:---:|:---:|:---:
/competianos|GET|Recebe uma lista com todos os competianos já cadastrados|standart
/competianos/email|GET|Recebe os dados do competiano cujo email é igual ao passado no corpo da requisição|standart
/competianos|POST|Cria um novo competiano|standart
/competianos|DELETE|Exclui um competiano|standart
/competianos|PUT|Atualiza os dados de um competiano|standart
/certificados|GET|Recebe uma lista com todos os certificados já cadastrados|standart
/certificados|POST|Registra os certificados salvos no link do drive na base de dados|standart 
