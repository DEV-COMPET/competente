import jsPDF from "jspdf";
import { join } from 'path';
import { convertImageToBase64, gerarPDF } from "./singlePagePDF";

const WIDTH_INCHES = 11.69;
const START_PIXELS_WIDTH = 409;
const END_PIXELS_WIDTH = 1586;

const HEIGHT_INCHES = 8.27;
const START_PIXELS_HEIGHT = 97;
const END_PIXELS_HEIGHT = 926;

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
  const width = widthFromPixelsToInches(1044);
  const textWidth = doc.getTextWidth(localData);
  const startX = (width / 2) - (textWidth / 2);
  doc.text(localData, startX, height);
}

function createInstructionalPDFPage(doc: jsPDF, base64Image: string) {
  const WIDTH_INCHES = 11.69;
  const HEIGHT_INCHES = 8.27;

  doc.addImage(base64Image, 'PNG', 0, 0, WIDTH_INCHES, HEIGHT_INCHES);

  doc.setFont('helvetica');
  doc.setFontSize(21.5);

  const firstLine = 'Para imprimir apenas seu certificado pressione Ctrl + F e';
  centerTextAtGivenHeight(firstLine, heightFromPixelsToInches(308), doc);

  const secondLine = 'pesquise pelo seu nome, em seguida pressione Ctrl + P e';
  centerTextAtGivenHeight(secondLine, heightFromPixelsToInches(346), doc);

  const thirdLine = 'selecione para imprimir apenas a página atual.';
  centerTextAtGivenHeight(thirdLine, heightFromPixelsToInches(384), doc);
}

export async function generatePDFMultiplePages(nameArray: string[], eventType: string, eventName: string, date: string, minutes: string, local: string, nomeSaida: string = 'certificados.pdf'): Promise<void> {
  let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: 'a4'
  });

  if(!nomeSaida.endsWith('.pdf')) nomeSaida += '.pdf';
  
  nameArray.sort();
  const imagePath = join(__dirname, '.', 'assets', 'talks_template.jpg');
  const base64Image = await convertImageToBase64(imagePath);
  createInstructionalPDFPage(doc, base64Image);
  doc.setFontSize(16); // default font size

  doc.addPage();

  const size = nameArray.length;
  for(let index = 0; index < size; index++) {
      const name = nameArray[index];
      doc = await gerarPDF(name, eventType, eventName, date, minutes, local, doc);
      if(index < nameArray.length - 1) doc.addPage();
  }
  doc.save(nomeSaida);
}
