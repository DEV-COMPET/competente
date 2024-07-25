import * as fs from 'fs';
import * as path from 'path';



export function getMarkdownFiles(folderPath: string): string[] {
    const files: string[] = [];

    const folderContents = fs.readdirSync(folderPath);

    folderContents.forEach(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            if (path.extname(file) === '.md') {
                // Remove a extensão .md e adiciona ao array
                const fileName = path.basename(file, '.md');
                files.push(fileName);
            }
        }
    });

    return files;
}

export function printFiles(folderPath: string): void {
    const folderContents = fs.readdirSync(folderPath);

    folderContents.forEach(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if(stats.isFile())
            console.log(file);
    });
}
