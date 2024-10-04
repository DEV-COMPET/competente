import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

export async function getNumberOfPages(filePath: string) {
  const pdfBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  return pdfDoc.getPageCount();
}