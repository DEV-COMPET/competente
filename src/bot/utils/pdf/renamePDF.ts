import { promises as fs } from 'fs';

export async function renamePdf(oldPath: string, newPath: string): Promise<void> {
    try {
        await fs.rename(oldPath, newPath);
        console.log(`Arquivo renomeado de ${oldPath} para ${newPath}`);
    } 
    catch(error) {
        console.error('Erro ao renomear o arquivo:', error);
    }
}