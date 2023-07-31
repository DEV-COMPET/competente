# Gerador de certificados

Olá, seja muito bem vindo a seção que trata do gerador de certificados no ambiente do Competente!
Antes de tudo, gostaria de dizer que o código utilizado difere bastante em relação aos códigos que circulam por ai no Compet, e por isso a sua utilização também difere dos usos convencionais.

Este é um programa em Python que permite gerar certificados usando dados de uma planilha CSV, um modelo de texto e uma imagem para a assinatura. O programa utiliza a biblioteca ReportLab para criar os certificados em formato PDF.

## Pré-requisitos
Além de claro, possuir o python3 instalado na sua máquina, você também precisará 
instalar a biblioteca ReportLab. É altamente recomendado que você faça isso dentro de um ambiente virtual do Python. Caso não tenha experiência com Python, siga as instruções abaixo para executar o programa.

## Instalação

Para instalar a biblioteca ReportLab, execute o seguinte comando no terminal:

```bash
pip install reportlab
```
Ademais, o script é diretamente executado pelo node então não é necessário executar o script diretamente pelo python.
Caso queira saber mais consulte a documentação do script no drive do Compet!

## O que há de novo aqui?

* O script do bot não é utilizado por um ser humano, e não é necessário a criação de um arquivo csv pra gerar os certificados com base nele. Ao invés disso podemos simplesmente utilizar a lista retornada pelo utility da api do google forms com esse propósito.

* Outro fator importante é que o texto gerado no código agora precisa de mais variáveis, como o evento, a data do evento e a duração em horas e minutos. Com isso em mente, faz-se necessário o uso de variáveis do prompt pra que esses valores sejam passados corretamente.

## O que é necessário para gerar os certificados?

1. Primeiramente é necessário ter um arquivo png que será o template básico para utilização do certificado. Esse arquivo deve ser colocado na pasta `src/bot/utils/python/` e deve ser nomeado como `NOME-DO-TEMPLATE_template.png`.

2. Em seguida o arquivo de texto que será utilizado como base para o certificado deve ser colocado na pasta `src/bot/utils/python/` e deve ser nomeado como `NOME-DO-TEMPLATE_content.txt`.

3. E por fim as fontes do arquivo que por padrão são as fontes yu-gothic-bold.ttf e yu-gothic-light.ttf que devem ser colocadas na pasta `src/bot/utils/python/`.