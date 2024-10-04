import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

export async function setTitle(inputPath: string, outputPath: string, newTitle: string): Promise<void> {
    try {
        const existingPdfBytes = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        pdfDoc.setTitle(newTitle);

        const pdfBytes = await pdfDoc.save();

        await fs.writeFile(outputPath, pdfBytes);

        console.log(`Título do PDF alterado para "${newTitle}" com sucesso!`);
    } catch (error) {
        console.error('Erro ao alterar o título do PDF:', error);
    }
}