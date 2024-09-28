import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function compressPdf(inputPath: string, outputPath: string, quality: string = 'ebook'): Promise<void> {
    try {
        // Remover backslashes dos caminhos de arquivos
        const sanitizedInputPath = inputPath.replace(/\\/g, '');
        const sanitizedOutputPath = outputPath.replace(/\\/g, '');

        const command = `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/${quality} -dNOPAUSE -dBATCH -dQUIET -sOutputFile="${sanitizedOutputPath}" "${sanitizedInputPath}"`;
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            console.error('Erro ao comprimir PDF:', stderr);
        } else {
            console.log('PDF comprimido com sucesso:', stdout);
        }
    } catch (error) {
        console.error('Erro ao executar o Ghostscript:', error);
    }
}
