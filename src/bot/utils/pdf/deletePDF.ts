import { promises as fs } from 'fs';

export async function deletePdf(filePath: string): Promise<void> {
    try {
        await fs.unlink(filePath);
        console.log(`Arquivo ${filePath} deletado com sucesso`);
    }
    catch(error) {
        console.error('Erro ao deletar o arquivo:', error);
    }
}