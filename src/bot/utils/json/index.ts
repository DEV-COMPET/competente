// def partial_to_full_path(path=""):
//     from pathlib import Path
// 
//     parent = Path(__file__).parent
//     for _ in range(path.count('../')):
//         parent = parent.parent
//     parent = str(parent)
// 
//     barras = path.count('../') * '../'
//     parent += path[path.find(barras) + len(barras) - 1:]
//     return parent

// import * as path from "path";
// 
// function partial_to_full_path(dirname: string, partial: string) {
// 
//     const parent_count = (partial.match((/\/../g)) || [])?.length
// 
//     let parent = dirname
// 
//     for(let i=0; i<parent_count; i++) {
//         parent = path.dirname(parent)
//     }
//  
//     let barras = "" 
//     
//     for(let i=0; i<parent_count; i++) barras += '../'
// 
//     parent += 
// }

import * as fs from 'fs';
import * as path from "path";

export function readJsonFile(dirname: string, name: string) {
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


