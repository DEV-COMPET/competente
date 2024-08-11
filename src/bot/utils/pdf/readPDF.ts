import fs from 'fs'

export async function readPdfFile(filePath: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          reject(new Error(`Erro ao ler o arquivo PDF: ${err}`));
        } else {
          resolve(fileData);
        }
      });
    });
  }