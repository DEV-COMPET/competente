import * as fs from 'fs';
import * as path from "path";

export interface readJsonFileRequest {
  dirname: string,
  name: string
}

export function readJsonFile({ dirname, name }: readJsonFileRequest) {
  const filePath = path.join(dirname, name);

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(jsonData);

    return jsonObject;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}


