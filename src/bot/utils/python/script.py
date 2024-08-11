#!./venv/bin/python
# -*- coding: utf-8 -*-

import importlib
import time
from reportlab.pdfgen import canvas
import sys
import argparse
import re
import os
from datetime import datetime
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

desc = """
Esta é uma versão atualizada do programa geradorCertificados para python3

Para utilizar este programa, deve-se instalar o reportlab com o comando pip install reportlab. É ALTAMENTE recomendado que isto seja feito dentro de um ambiente virtual (veja: https://docs.python.org/pt-br/3/library/venv.html)

Caso não tenha experiência com python, este código pode ser executado de diferentes maneiras:
-(Linux): python3 geradorCertificados.py ...
-(Windows): py geradorCertificados.py ...
-(Linux após executar "chmod +x geradorCertificados.py"): ./geradorCertificados.py ...
"""

exp = """

Notas:

Certifique-se que os artefatos utilizados pelo programa estão codificados corretamente:
SE ESTIVER USANDO WINDOWS:  Todos os artefatos de texto utilizados pelo programa devem estar codificados em ISO 8859-15
SE ESTIVER USANDO LINUX:    Os artefatos de texto devem estar codificados em UTF-8
IMAGENS: Formato .jpg

É possível verificar a codificação do CSV e modelo de texto utilizados pelo comando 'file -bi [arquivo]' (Linux) ou executando 'file --mime-encoding' (Windows com git/Cygwin). É possível alterar esta codificação utilizando 'iconv -f [codificação atual] -t [codificação desejada] -o [arquivo a ser criado] [arquivo a ser convertido]' em distribuições Linux.

Alternativamente, editores de texto como Notepad (Windows), Notepad++ ou Visual Studio Code tem a capacidade de exibir e alterar a codificação de um arquivo.

Exemplos de Uso:

    Exibe Ajuda:
./geradorCertificados.py -h

    Lista fontes disponíveis:
./geradorCertificados.py -lf

    Cria certificados utilizando a planilha 'planilha.csv', o modelo 'modelo.txt' e a imagem 'imagem.jpg':
./geradorCertificados.py planilha.csv modelo.txt imagem.jpg

    Cria certificados utilizando os artefatos anteriores, utilizando a fonte "Courier" e o delimitador do arquivo CSV (separador) ";":
./geradorCertificados.py planilha.csv modelo.txt imagem.jpg -f "Courier" -s ";"

    Cria certificados utilizando os artefatos anteriores, no tamanho 40 e substituindo a fonte em negrito por "Times_Roman":
./geradorCertificados.py planilha.csv modelo.txt imagem.jpg -t 40 -F "Times_Roman"

    Cria certificados utilizando os artefatos anteriores, verbalizando as etapas de execução, e o salvando no nome "Meus_Certificados.pdf":
./geradorCertificados.py planilha.csv modelo.txt imagem.jpg -v -d "./Meus_Certificados.pdf"
"""

#Código para acionar opções pelo prompt de comando
def data_legivel(data):
    meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
    data_obj = datetime.strptime(data, "%d-%m-%Y")
    dia = int(data_obj.strftime("%d"))
    mes = meses[int(data_obj.strftime("%m")) - 1]
    ano = int(data_obj.strftime("%Y"))
    return f"{dia} de {mes} de {ano}"

parser = argparse.ArgumentParser(description=desc,
                                 epilog=exp,
                                 formatter_class=argparse.RawTextHelpFormatter)
def setup_parser():
    parser.add_argument("texto",
                        help="Texto base utilizado no certificado",
                        nargs="?")
    parser.add_argument("imagem",
                        help="Imagem de fundo utilizada no certificado",
                        nargs="?")
    parser.add_argument("evento", help="O nome do evento", type=str, nargs="?")
    parser.add_argument("data",
                        help="A data em que o evento foi realizado",
                        type=str,
                        nargs="?")
    parser.add_argument("hora",
                        help="A quantidade de horas que o evento durou",
                        type=str,
                        nargs="?")
    parser.add_argument("minutos",
                        help="A quantidade de minutos do evento",
                        type=str,
                        nargs="?")
    parser.add_argument("dataFinal",
                        help="A data final do evento",
                        type=str,
                        nargs="?")
    parser.add_argument("listaNomes",
                        help="Uma lista contendo os participantes do evento",
                        type=str,
                        nargs="+")
    parser.add_argument(
        "-d",
        "--destino",
        type=str,
        help=
        "Local e nome de onde e salvo o certificado. Caso não seja fornecido, é usado o local da execucao do script, sob o nome 'Certificados'"
    )
    parser.add_argument(
        "-f",
        "--fonte",
        type=str,
        help=
        "Determina a fonte a ser utilizada no certificado. Por padrao, a fonte utilizada e 'Helvetica' Para uma lista de todas as fontes suportadas, execute geradorCertificados.py com a opção -lf"
    )
    parser.add_argument(
        "-F",
        "--fonteNegrito",
        type=str,
        help="Determina a fonte em negrito a ser utilizada no certificado.")
    parser.add_argument(
        "-lf",
        "--listaFontes",
        help=
        "Printa uma lista das fontes utilizaveis para fabricacao de um certificado",
        action="store_true")
    parser.add_argument(
        "-s",
        "--separador",
        type=str,
        help=
        "Especifica o caractere delimitador de colunas utilizado no arquivo CSV. Por padrao, o delimitador utilizado e ','"
    )
    parser.add_argument("-t", "--tamanho", type=int, help="Tamanho da fonte")
    parser.add_argument("-v",
                        "--verbose",
                        help="Explica o que o programa faz durante execução",
                        action="store_true")
    
setup_parser()

args = parser.parse_args()
dirname = os.path.dirname(__file__)
tmp_dir = os.path.join(os.path.abspath(os.path.dirname(os.path.dirname(dirname))),"tmp")

elementos = args.data.split("-")

nome_underline = str(args.evento).replace(' ', '_')
path_new = f"{elementos[2]}_{elementos[1]}_{elementos[0]}-{nome_underline}"

dest_path = os.path.join(tmp_dir, f'{path_new}.pdf')
txt_name = os.path.join(dirname, args.texto)
img_name = os.path.join(dirname, args.imagem)
reader = args.listaNomes
evento = args.evento
dataFinal = args.dataFinal
if(args.dataFinal != ""):
    dataFinal = data_legivel(args.dataFinal)

data = data_legivel(args.data)
hora = args.hora
minutos = args.minutos

dateX = 100
dateY = 500

importlib.reload(sys)
#sys.setdefaultencoding('utf8')

#Caracter que indica variavel
var_char = '%'

#Caracter que indica negrito
bold_char = '#'

italic_char = '&*'  #Helvetica-Oblique

#Caractere delimitador de coluna (csv)
sep_char = ','

#tamanho da imagem
width = 3507
height = 2475

#definições da fonte
#AQUI VOCÊ INFORMA AO PROGRAMA QUAIS FONTES QUER USAR, NA FUNÇÃO
# pdfmetrics.registerFont(TTFont('APELIDO_DA_FONTE', 'NOME_DO_ARQUIVO_DA_FONTE.ttf'))
# É RECOMENDÁVEL QUE OS ARQUIVOS DAS FONTES ESTEJAM NA MESMA PASTA QUE ESTE ARQUIVO
pdfmetrics.registerFont(TTFont('normal', os.path.join(dirname,
                                                      'yugothib.ttf')))
pdfmetrics.registerFont(
    TTFont('light', os.path.join(dirname, 'yu-gothic-light.ttf')))
pdfmetrics.registerFont(
    TTFont('negrito', os.path.join(dirname, 'yu-gothic-bold.ttf')))

# AQUI SE ATRIBUI A VARIÁVES OS APELIDOS DADOS AS FONTES
#data atual
mes_ext = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro'
}


data = elementos[0]
data += " de "
data += mes_ext[int(elementos[1])]
data += " de "
data += elementos[2]

"""
data = time.strftime("%d")
data += " de "
data += mes_ext[int(time.strftime("%m"))]
data += " de "
data += time.strftime("%Y")
"""

#variaveis auxiliares
x = width
y = 2800  #y=height
fator_decaimento = 0.30
proporcao = 0.04
epsilon = 0.0


pdf = canvas.Canvas(dest_path, (width, height))

if args.listaFontes:
    for f in pdf.getAvailableFonts():
        print(f)
    exit()


if args.destino: dest_path = args.destino
if args.fonte:
    fonte = args.fonte in fontes or "Helvetica"
    fonte_bold = args.fonte + "-Bold" in fontes or fonte
if args.fonteNegrito:
    fonte_bold = args.fonteNegrito in fontes or fonte_bold
if args.tamanho: tam_fonte = args.tamanho

def gerar_pdf(txt_name,image_name,data,hora,minutos,evento,reader,dataFinal):
    fonte = "light"  # FONTE PADRÃO DO TEXTO
    fonte_bold = "negrito"
    fontB = fonte_bold  # IGNORE
    tam_fonte = 90
    tam_nome = 85
    tam_texto = 80
    #fonte_italic = "light"
    fonte_italic = "Times-Italic"
    #fonte_italic = "Times-BoldItalic"
    
    campos = ["nome", "data", "hora", "minutos", "evento","dataFinal"]
    fields = {
        "nome": "",
        "data": data,
        "hora": hora,
        "minutos": minutos,
        "dataFinal":dataFinal,
        "evento": evento
    }
    text_lines = open(txt_name, 'r', -1, "utf-8").read().split(
        '\n')  # Lê o arquivo de texto no formato utf-8
    
    aux = fator_decaimento
    #pagina inicial de "tutorial" de como remover apenas o seu certificado
    pdf.drawImage(img_name, 0, 0, width, height)
    pdf.setFont('Helvetica', tam_fonte, leading=None)
    pdf.drawCentredString(x / 2, y - (y * aux), "")
    aux = aux + proporcao
    pdf.drawCentredString(
        x / 2, y - (y * aux),
        "Para imprimir apenas seu certificado pressione Ctrl + F e ")
    aux = aux + proporcao
    pdf.drawCentredString(
        x / 2, y - (y * aux),
        "pesquise pelo seu nome, em seguida pressione Ctrl + P e")
    aux = aux + proporcao
    pdf.drawCentredString(x / 2, y - (y * aux),
                          "selecione para imprimir apenas a página atual.")
    pdf.showPage()
    
    count = 0
    for row in reader:
        fields["nome"] = row
        aux = fator_decaimento
        pdf.drawImage(img_name, 0, 0, width, height)
        for line in text_lines:
            aux_line = line
            if (len(aux_line) == 0):
                continue
            for campo in campos:
                aux_line = aux_line.replace(var_char + campo + var_char,fields[campo])
                tam_fonte = tam_texto
                #CASO QUEIRA ADICIONAR MAIS UM TRATAMENTO ESPECIAL A UM CARACTERE QUE
                #TENHA COMO OBJETIVO ALTERAR O TEXTO, ADICIONE MAIS UMA EXPRESSÃO CONDICIONAL,
                #SEGUIDA DAS ALTERAÇÕES DESEJADAS.
            if re.search(r'&\$', aux_line):
                aux_segs = aux_line.split('&$')
                fonte_bold = fonte_italic  # Define fonte_bold como fonte_italic
                tam_fonte = tam_texto
            if re.search('&*', aux_line):
                aux_segs = aux_line.split(italic_char)  #APAGA O CARACTERE ESPECIAL
                fonte_bold = fonte_italic  #POR PADRÃO, FONTE_BOLD = A NOVA FONTE
                tam_fonte = tam_texto  # TAMANHO DA NOVA FONTE
                
            
            if re.search('#', aux_line):
                aux_segs = aux_line.split(bold_char)
                fonte_bold = fontB
                tam_fonte = tam_nome
    
            #aux_segs = aux_line.split(bold_char)
            flip = False
            length = 0
            #print('Texto: '+aux_segs+" \n")
            for seg in aux_segs:
                fnt = None
                if flip:
                    fnt = fonte_bold
                else:
                    fnt = fonte
                length += (1 + epsilon) * pdf.stringWidth(seg, fnt, tam_fonte)
                flip = not flip
            to = pdf.beginText()
            to.setTextOrigin((x - length) / 2, y - (y * aux))
            flip = False
            for seg in aux_segs:
                fnt = None
                if flip: fnt = fonte_bold
                else: fnt = fonte
                to.setFont(fnt, tam_fonte)  #tam_fonte
                to.textOut(seg)
                #print(to.getCursor())
                flip = not flip
            pdf.drawText(to)
            aux = aux + proporcao
    
        #pdf.stringWidth(date, fnt, tam_fonte)
        pdf.setFont('light', 75)
        pdf.drawString(200, 600, "Belo Horizonte, " + data)
        # pdf.drawString(2300,630,"andre") #localização da assinatura
        pdf.showPage()
    
    if not os.path.exists(tmp_dir):
        os.makedirs(tmp_dir)
    pdf.save()
    
    print(dest_path)
    
gerar_pdf(txt_name,img_name,data,hora,minutos,evento,reader,dataFinal)