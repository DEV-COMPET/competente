import * as fs from 'fs';

export function getStepByStep(filePath: string): string {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Expressão regular para encontrar a subseção ## Passo a Passo
    const passoRegex = /##\s*Passo\s*a\s*Passo\s*([\s\S]*?)(?=##|$)/i;

    // Procura pela subseção no conteúdo do arquivo
    const match = fileContent.match(passoRegex);

    if (match) {
        // Retorna o conteúdo da subseção (sem a marcação)
        return match[1].trim();
    } 
    else return "Sem passo a passo";
}