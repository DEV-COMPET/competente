import * as fs from 'fs';
import * as path from "path";

export interface readJsonFileRequest {
  dirname: string,
  partialPath: string
}

export function partial_to_full_path({ dirname, partialPath }: readJsonFileRequest): string {
  return path.join(dirname, partialPath);
}

export function readJsonFile({ dirname, partialPath }: readJsonFileRequest) {

  const filePath = partial_to_full_path({dirname, partialPath});

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(jsonData);

    return jsonObject;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

export function saveDataToJson(data: any[] | any, fileName: string) {
  try {
      const dirPath = partial_to_full_path({
          dirname: __dirname, partialPath: "../../../../"
      });

      // Create the directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
      }

      const filePath = path.join(dirPath, fileName);
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, jsonString, 'utf-8');
      console.log(`Os dados foram salvos em ${filePath}`);
  } catch (error) {
      console.error('Erro ao salvar os dados em JSON:', error);
  }
}

