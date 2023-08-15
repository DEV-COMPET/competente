# Competente

Para adicionar o competente no seu servidor do discord, basta clicar neste [link](https://discord.com/api/oauth2/authorize?client_id=1054755402346143816&permissions=8&scope=bot).

## Getting Started

Para contribuir com o desenvolvimento do competente, você precisa estar familiarizado com a [API do discord](https://discord.js.org/#/) e sua utilização com o typescript

### Variáveis de ambiente
O bot em questão utiliza algumas variáveis de ambiente que você deve configurar pessoalmente para o desenvolvimento. Para tal, você deve primeiramente adicionar as variáveis de ambiente no arquivo `.env` que deve estar localizado na raiz do projeto conforme o arquivo `.env.example`.

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
