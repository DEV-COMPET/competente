import { readFile } from 'fs/promises';
import { join } from 'path';
import jsPDF from 'jspdf';

import { yuGothicBoldFont } from './assets/fonts/yu-gothic-bold';
import { yuGothicLight } from './assets/fonts/yu-gothic-light';
import { timesItalicNormal } from './assets/fonts/times-italic-normal';

const WIDTH_INCHES = 11.69;
const START_PIXELS_WIDTH = 409;
const END_PIXELS_WIDTH = 1587;

const HEIGHT_INCHES = 8.27;
const START_PIXELS_HEIGHT = 97;
const END_PIXELS_HEIGHT = 928;

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
  const width = widthFromPixelsToInches(1012);
  const textWidth = doc.getTextWidth(localData);
  const startX = (width / 2) - (textWidth / 2);
  doc.text(localData, startX, height);
}

export const convertImageToBase64 = async (filePath: string): Promise<string> => {
  const fileData = await readFile(filePath);
  return `data:image/png;base64,${fileData.toString('base64')}`;
};

const generatePDF = async (
    imgWidth: number,
    imgHeight: number,
    participantName: string,
    eventType: string,
    eventName: string,
    date: string,
    minutes: string,
    local: string,
    doc: jsPDF
): Promise<jsPDF> => {
    const imagePath = join(__dirname, '.', 'assets', 'talks_template.jpg');
    const base64Image = await convertImageToBase64(imagePath);
    doc.addImage(base64Image, 'PNG', 0, 0, imgWidth, imgHeight);

    doc.addFileToVFS('yu-gothic-light-normal.ttf', yuGothicLight);
    doc.addFont('yu-gothic-light-normal.ttf', 'yu-gothic-light', 'normal'); 
    doc.setFont('yu-gothic-light', 'normal');
    const firstText = 'Concedemos a';
    centerTextAtGivenHeight(firstText, heightFromPixelsToInches(270), doc);

    doc.addFileToVFS('yu-gothic-bold-normal.ttf', yuGothicBoldFont);
    doc.addFont('yu-gothic-bold-normal.ttf', 'yu-gothic-bold', 'normal');
    doc.setFont('yu-gothic-bold');

    centerTextAtGivenHeight(participantName, heightFromPixelsToInches(346), doc);
     
    doc.setFont('yu-gothic-light', 'normal');

    const firstLine = `o presente certificado pela apresentação da palestra`;
    centerTextAtGivenHeight(firstLine, heightFromPixelsToInches(422), doc);

    // Set the font for the italicized text
    doc.addFileToVFS('times-italic-normal.ttf', timesItalicNormal);
    doc.addFont('times-italic-normal.ttf', 'Times Italic', 'normal');
    doc.setFont('times', 'bolditalic');
    const secondLine = `${eventName},`;
    centerTextAtGivenHeight(secondLine, heightFromPixelsToInches(459), doc);

    doc.setFont('yu-gothic-light', 'normal');
    const thirdLine = 'durante o evento COMPET Talks, organizado pelo COMPET,';
    centerTextAtGivenHeight(thirdLine, heightFromPixelsToInches(496), doc);

    const fourthLine = `grupo PET de Engenharia de Computação do CEFET-MG, realizado no dia`;
    centerTextAtGivenHeight(fourthLine, heightFromPixelsToInches(533), doc);

    const fifthLine = `${date}, durante ${minutes}.`
    centerTextAtGivenHeight(fifthLine, heightFromPixelsToInches(572), doc);

    const localData = `${local}, ${date}`;
    centerLocalDataAtGivenHeight(localData, heightFromPixelsToInches(728), doc);

    return doc;
};

export async function gerarPDF(participantName: string, eventType: string, eventName: string, date: string, minutes: string, local: string, doc: jsPDF) {
  const imgWidth = WIDTH_INCHES;
  const imgHeight = HEIGHT_INCHES;
  return generatePDF(imgWidth, imgHeight, participantName, eventType, eventName, date, minutes, local, doc);
}