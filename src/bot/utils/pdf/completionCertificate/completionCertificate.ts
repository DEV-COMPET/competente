import { readFile } from 'fs/promises';
import { join } from 'path';
import jsPDF from 'jspdf';

import { yuGothicBoldFont } from './../assets/fonts/yu-gothic-bold';
import { yuGothicLight } from './../assets/fonts/yu-gothic-light';

const WIDTH_INCHES = 11.69;
const START_PIXELS_WIDTH = 463;
const END_PIXELS_WIDTH = 1457;

const HEIGHT_INCHES = 8.27;
const START_PIXELS_HEIGHT = 188;
const END_PIXELS_HEIGHT = 892;

function heightFromPixelsToInches(pixels: number) {
  const inches = ((pixels - START_PIXELS_HEIGHT) * HEIGHT_INCHES) / (END_PIXELS_HEIGHT - START_PIXELS_HEIGHT);
  return inches;
}

function widthFromPixelsToInches(pixels: number): number {
  const inches = ((pixels - START_PIXELS_WIDTH) * WIDTH_INCHES) / (END_PIXELS_WIDTH - START_PIXELS_WIDTH);
  return inches;
}

function centerTextAtGivenHeight(text: string, height: number, doc: jsPDF) {
  const docWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(text);
  const startX = (docWidth / 2) - (textWidth / 2);
  doc.text(text, startX, height);
}

function centerLocalDataAtGivenHeight(localData: string, height: number, doc: jsPDF) {
  const width = widthFromPixelsToInches(930); // começo da linha de assinatura do André
  const textWidth = doc.getTextWidth(localData);
  const startX = (width / 2) - (textWidth / 2);
  doc.text(localData, startX, height);
}

// Function to read an image file and convert it to Base64
const convertImageToBase64 = async (filePath: string): Promise<string> => {
  const fileData = await readFile(filePath);
  return `data:image/png;base64,${fileData.toString('base64')}`;
};

// os valores em pixels foram obtidos no Canva usando as réguas e o grid
const generatePDF = async (imgWidth: number, imgHeight: number, participantName: string, local: string, dataEntrada: string, dataSaida: string, dataEmissao: string, nomeSaida: string) => {
  // Initialize jsPDF with landscape orientation and A4 format
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: 'a4'
  });

  // Path to your image in the assets folder
  const imagePath = join(__dirname, '..', 'assets', 'template_certificado.jpg');
  const base64Image = await convertImageToBase64(imagePath);

  // Add the image as the background
  doc.addImage(base64Image, 'PNG', 0, 0, imgWidth, imgHeight);

  doc.addFileToVFS('yu-gothic-light-normal.ttf', yuGothicLight);
  doc.addFont('yu-gothic-light-normal.ttf', 'yu-gothic-light', 'normal'); 
  doc.setFont('yu-gothic-light', 'normal');

  const firstText = 'O Centro Federal de Educação Tecnológica de Minas Gerais';
  centerTextAtGivenHeight(firstText, heightFromPixelsToInches(333), doc);
  const secondText = 'certifica que';
  centerTextAtGivenHeight(secondText, heightFromPixelsToInches(365), doc);

  doc.addFileToVFS('yu-gothic-bold-normal.ttf', yuGothicBoldFont);
  doc.addFont('yu-gothic-bold-normal.ttf', 'yu-gothic-bold', 'normal');
  doc.setFont('yu-gothic-bold');
  centerTextAtGivenHeight(participantName, heightFromPixelsToInches(428), doc);
  doc.setFont('yu-gothic-light', 'normal'); // voltar para o texto normal
  
  const firstLine = `participou do Programa de Educação Tutorial - PET-CEFET-MG, aprovado e`;
  centerTextAtGivenHeight(firstLine, heightFromPixelsToInches(461), doc);
  const secondLine = 'regulamentado pela Resolução CGRAD 10/14 de 14 de maio de 2014, no';
  centerTextAtGivenHeight(secondLine, heightFromPixelsToInches(492), doc);  
  const thirdLine = `curso de Engenharia de Computação, no período de ${dataEntrada} a ${dataSaida},`;
  centerTextAtGivenHeight(thirdLine, heightFromPixelsToInches(524), doc);
  const fourthLine = `cumprindo a carga horária de 20 (vinte) horas semanais.`;
  centerTextAtGivenHeight(fourthLine, heightFromPixelsToInches(556), doc);

  const localData = `${local}, ${dataEmissao}`;
  centerLocalDataAtGivenHeight(localData, heightFromPixelsToInches(720), doc);

  doc.save(nomeSaida);
};

export function gerarPDF(participantName: string, local: string, dataEntrada: string, dataSaida: string, dataEmissao: string, nomeSaida: string = "certificadoConclusao.pdf") {
  const imgWidth = WIDTH_INCHES; // width of A4 size in inches for landscape
  const imgHeight = HEIGHT_INCHES; // height of A4 size in inches for landscape
  if(!nomeSaida.endsWith('.pdf')) nomeSaida += '.pdf';
  return generatePDF(imgWidth, imgHeight, participantName, local, dataEntrada, dataSaida, dataEmissao, nomeSaida);
}