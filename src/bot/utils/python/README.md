# Gerador de certificados

Olá, seja muito bem vindo a seção que trata do gerador de certificados no ambiente do Competente!
Antes de tudo, gostaria de dizer que o código utilizado difere bastante em relação aos códigos que circulam por ai no Compet, e por isso a sua utilização também difere dos usos convencionais.

## O que há de novo aqui?

* O script do bot não é utilizado por um ser humano, e não é necessário a criação de um arquivo csv pra gerar os certificados com base nele. Ao invés disso podemos simplesmente utilizar a lista retornada pelo utility da api do google forms com esse propósito.

* Outro fator importante é que o texto gerado no código agora precisa de mais variáveis, como o evento, a data do evento e a duração em horas e minutos. Com isso em mente, faz-se necessário o uso de variáveis do prompt pra que esses valores sejam passados corretamente.

### Variáveis de prompt

As novas variáveis de prompt adicionadas para melhor versatilidade dos comandos  