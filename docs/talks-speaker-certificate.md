# /talks-speaker-certificate

## Descrição

Este comando cria um PDF com múltiplas páginas, uma para cada palestrante que ministrou a palestra (sendo que a primeira é uma página com instruções de como imprimir/baixar apenas uma página), envia-o a uma pasta do Drive e ao Autentique do André para assinar

1. Apresentação de um menu de seleção com as 25 palestras mais recentes.
2. Após selecionar uma palestra, é exibido um Modal que pede para digitar algumas informações, sendo elas:
    - Nome(s) do(s) palestrante(s) (caso haja mais de um, separar os nomes por ponto e vírgula ';')
        - Palestrante1; Palestrante2; Palestrante3; ...; PalestranteN
    - Data do talks
    - Duração do talks (em minutos)
3. Após o preenchimento do modal, é exibido um texto com o nome do Talks, a data do Talks, a duração do Talks e os nomes dos palestrantes
4. Junto ao texto, há três botões: um de **confirmação**, outro de **cancelamento** e outro de **redirecionamento** (redirecionar para pasta do Drive que possui os certificados)
5. Por fim, após confirmadas as informações, é gerado um PDF com o nome "Nome do Talks - Data do Talks - Certificados Palestrantes" no drive do COMPET. O caminho da pasta é: */COMPET/2024/2024.1/Desenvolvimento/Certificados/Talks/Palestrantes* (pode ser modificado. Dessa maneira, é recomendado usar o botão de redirecionamento)
6. Além disso, o certificado é enviado ao Autentique do André para assinar (enviado pela conta do Autentique do COMPET)


### Imagem Exemplificativa:
**Menu com os talks**

![Menu com os 25 talks mais recentes](./assets/talks-speaker-certificate-1.png)

**Modal que pede a data do evento e sua duração**

![Modal que pede a data do evento e sua duracao](./assets/talks-speaker-certificate-2.png)

**Texto com as informações selecionadas e enviadas e botões de confirmação, de cancelamento e de redirecionamento**

![Texto reconfirmando informacoes e butoes](./assets/talks-speaker-certificate-3.png)

**Processamento da geração de certificados**

![Processamento da geracao de certificados](./assets/talks-certificate-5.png)

**Resposta de sucesso após confirmar a operação e gerar os certificados**

![Resposta de sucesso apos geracao dos certificados](./assets/talks-speaker-certificate-4.png)

**Resposta de sucesso após cancelar a operação**

![Resposta de sucesso apos cancelamento da operacao](./assets/talks-certificate-6.png)

**Pasta com os PDFs gerados**

* *OBS*: Os PDFs no print são exemplos de teste que fizemos

![Pasta com os pdfs gerados pelo comando](./assets/talks-certificate-7.png)