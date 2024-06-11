import * as fs from 'fs';

export function getDescription(filePath: string): string {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Expressão regular para encontrar a subseção ## Descrição
    const descriptionRegex = /##\s*Descrição\s*([\s\S]*?)(?=##|$)/i;

    // Procura pela subseção no conteúdo do arquivo
    const match = fileContent.match(descriptionRegex);

    if (match) {
        // Retorna o conteúdo da subseção (sem a marcação)
        return match[1].trim();
    } 
    else return "Sem descrição";
}