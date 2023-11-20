import { Canvas, createCanvas, Image } from 'canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs/promises';
import path from 'path';


const imagesDir = path.join(__dirname, 'talks');
const fontsDir = __dirname;

const fonts = {
  regular: StandardFonts.Helvetica,
  bold: StandardFonts.HelveticaBold,
};

const images = {
  template: path.join(imagesDir, 'talks_template.jpg'),
};

const varChar = '$';
const boldChar = '#';
const italicChar = '&';

const fator_decaimento = 0.1; // Adjust as needed
const proporcao = 0.1; // Adjust as needed
const tam_texto = 10; // Adjust as needed
const tam_nome = 15; // Adjust as needed
const epsilon = 0.1; // Adjust as needed

let fonte_bold = fonts.bold; // Adjust as neededJ
let tam_fonte = tam_texto; // Adjust as needed

const widthg = 841.89; // Largura da A4 no modo paisagem (horizontal)
const heightg = 595.28; // Altura da A4 no modo paisagem (horizontal)

interface CertificateData {
  name: string;
  date: string;
  course: string;
}

interface GerarPdfRequest {
  txtName: string,
  imageName: string,
  data: string,
  hora: string,
  minutos: string,
  evento: string,
  reader: string[],
  dataFinal: string
}

export async function gerarPdf({ data, dataFinal, evento, hora, imageName, minutos, reader, txtName }: GerarPdfRequest) {
  
  console.dir({reader})
  
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([widthg, heightg]);
  const { width, height } = page.getSize();

  const templateImage = await fs.readFile(images.template);
  const templateImageDims = await getJpgImageDimensions(templateImage);

  const imageScale = Math.min(width / templateImageDims.width, height / templateImageDims.height);
  const imageWidth = templateImageDims.width * imageScale;
  const imageHeight = templateImageDims.height * imageScale;

  const x = (width - imageWidth) / 2;
  const y = (height - imageHeight) / 2;

  const image = await pdfDoc.embedJpg(templateImage);

  const campos = ['nome', 'data', 'hora', 'minutos', 'evento', 'dataFinal'];
  const fields = {
    nome: '',
    data,
    hora,
    minutos,
    dataFinal,
    evento,
  };

  const textLines = (await fs.readFile(txtName, 'utf-8')).split('\n');

  let auxiliar = fator_decaimento;
  page.drawImage(image, {
    x,
    y,
    width: imageWidth,
    height: imageHeight,
  });

  const fonteBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.setFont(fonteBold);
  page.setFontSize(tam_fonte);

  // Crie a primeira página e adicione o texto de instrução
  let aux = 0.1;
  let proporcao = 0.05;
  let textWidth = fonteBold.widthOfTextAtSize('Para imprimir apenas seu certificado pressione Ctrl + F e', tam_fonte);
  let textHeight = fonteBold.heightAtSize(tam_fonte);

  page.drawText('Para imprimir apenas seu certificado pressione Ctrl + F e', {
    x: (page.getWidth() - textWidth) / 2,
    y: (page.getHeight() - textHeight) / 2 + page.getHeight() * aux,
    size: tam_fonte,
    font: fonteBold,
    color: rgb(0, 0, 0),
  });
  aux += proporcao;

  textWidth = fonteBold.widthOfTextAtSize('pesquise pelo seu nome, em seguida pressione Ctrl + P e', tam_fonte);

  page.drawText('pesquise pelo seu nome, em seguida pressione Ctrl + P e', {
    x: (page.getWidth() - textWidth) / 2,
    y: (page.getHeight() - textHeight) / 2 + page.getHeight() * aux,
    size: tam_fonte,
    font: fonteBold,
    color: rgb(0, 0, 0),
  });
  aux += proporcao;

  textWidth = fonteBold.widthOfTextAtSize('selecione para imprimir apenas a página atual.', tam_fonte);

  page.drawText('selecione para imprimir apenas a página atual.', {
    x: (page.getWidth() - textWidth) / 2,
    y: (page.getHeight() - textHeight) / 2 + page.getHeight() * aux,
    size: tam_fonte,
    font: fonteBold,
    color: rgb(0, 0, 0),
  });

  // Crie uma nova página para o texto do script
  for (const row of reader) {
    let page = pdfDoc.addPage([widthg, heightg]);
    const { width, height } = page.getSize();
    fields.nome = ''; // Initialize the nome field
    if (typeof row === 'object' && 'nome' in row) {
      fields.nome = (row as { nome: string }).nome; // Assign the value of row.nome to fields.nome if it exists
    }
    aux = fator_decaimento;

    page.drawImage(image, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
    });

    let textY = height - 50; // Start at the top of the page
    for (const line of textLines) {
      let auxLine = line;
      if (auxLine.length === 0) {
        continue;
      }
      const fields: { [key: string]: string } = {
        nome: reader[0],
        data,
        hora,
        minutos,
        dataFinal,
        evento: evento.replace('*', ''), // Remova o '*' antes do evento
      };
      const fonteRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fonteBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fonteItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      for (const campo of campos) {
        const regex = new RegExp(`%${campo}%`, 'g');
        auxLine = auxLine.replace(regex, fields[campo]);
      }

      let tam_fonte = tam_texto;
      let fonte = fonteRegular;
      if (auxLine.includes('#')) {
        fonte = fonteBold;
        auxLine = auxLine.replace('#', ''); // Remove '#'
      }
      if (auxLine.includes('&')) {
        fonte = fonteItalic;
        auxLine = auxLine.replace('&', ''); // Remove '&'
      }

      // Draw the text with the function page.drawText
      page.setFont(fonte);
      page.setFontSize(tam_fonte);
      page.drawText(auxLine, { // Here, you need to specify the text that should be drawn
        x: (page.getWidth() - textWidth) / 2, // Start at the left edge of the page
        y: textY,
      });

      // Move down for the next line of text
      textY -= tam_fonte;
    }

    // Verifique se esta é a última linha do leitor antes de adicionar uma nova página
    if (reader.indexOf(row) !== reader.length - 1) {
      page = pdfDoc.addPage([widthg, heightg]);
      textY = page.getHeight() - 50; // Comece no topo da página
    }
  }

  const pdfBytes = await pdfDoc.save();
  await fs.writeFile('certificate.pdf', pdfBytes);
  return 'certificate.pdf';
}

async function getJpgImageDimensions(image: Buffer) {
  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = image;
  ctx.drawImage(img, 0, 0);
  return { width: img.width, height: img.height };
}

const txtName = 'certificate.txt';