import { PythonShell } from 'python-shell';
import path from 'path';
import { execSync } from 'child_process';
import { competDirectories, talksDirectories } from './constants';
import fs from 'fs';
import {promises as fsPromise} from "fs"
function formatTextToMaxLineLength(text:string, maxLineLength:number) {
  const words = text.split(' ');
  let currentLineLength = 0;
  let formattedText = '';

  words.forEach((word) => {
    if (currentLineLength + word.length <= maxLineLength) {
      formattedText += word + ' ';
      currentLineLength += word.length + 1;
    } else {
      formattedText += '\n' + word + ' ';
      currentLineLength = word.length + 1;
    }
  });

  return formattedText.trim();
}

const buildTXTFileFromModel = ({nome,data_inicio,data_fim,horas_semanais,descricao_certificado}:ISingleCertificateProps)=>{
  const text_dir = path.join(__dirname,competDirectories.content)
  const file =fs.readFileSync(text_dir,'utf-8')
  const new_data = file.replace("%nome%",nome)
  .replace("%data_inicio%",data_inicio)
  .replace("%data_fim%",data_fim)
  .replace("%horas_semanais%",horas_semanais)
  .replace("%evento%",descricao_certificado);
  const newText = formatTextToMaxLineLength(new_data, 60)
const new_text_dir = `${competDirectories.content.split('/')[0]}/new-${competDirectories.content.split('/')[1]}`
  fs.writeFileSync(path.join(__dirname,new_text_dir),newText,{flag:"w"});
  return new_text_dir
}
const isWin = process.platform === "win32";
const isLinux = process.platform === "linux";
let pythonPath= "";
if(isLinux){
  pythonPath = execSync('which python3').toString().trim();
}
if(isWin){
  pythonPath ='python'
}
// caminho para o arquivo script.py
const scriptPath = path.resolve(__dirname, "script.py");
interface ICreateCertificateProps {
  text_dir: string,
  template_dir: string,
  titulo?: string,
  data: string,
  horas: string,
  minutos?: string,
  listaNomes: string[]|string
  data_final?: string,
}
interface ITalksProps {
  titulo: string,
  listaNomes: string[]
  horas?: string,
  minutos?: string
  data: string
}
interface ISingleCertificateProps {
  descricao_certificado: string,
  nome: string,
  data_inicio: string,
  data_fim: string,
  horas_semanais:string
  dir_template?:string
}
async function createCertificate({
  data,
  horas,
  listaNomes,
  minutos="0",
  template_dir,
  text_dir,
  titulo="",
  data_final=formatarData(new Date(Date.now())) }: ICreateCertificateProps
): Promise<string[] | undefined> {
  const aux_args: string[] = [];
  aux_args.push(text_dir, template_dir, titulo, data, horas, minutos,data_final)
  const args = aux_args.concat(listaNomes);
  const options = {
    pythonPath,
    args
  }
  try {

    const response = await PythonShell.run(scriptPath, options);

    return response

  } catch (error) {
    console.error(error);
  }
}
export async function createTalksPdf({ titulo, listaNomes, horas = "1", minutos = "30", data }: ITalksProps): Promise<string> {
  const text_dir = talksDirectories.content // Arquivo de texto que contém o texto do certificado
  const template_dir = talksDirectories.template // Imagem que contém o template do certificado
 
  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir})
  
  if (!response) throw new Error("Erro na criação do certificado!");
  const path_to_certificate: string = response[0]
  return path_to_certificate
}
// retorna o path do certificado criado
export function formatarData(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear().toString();
  return `${dia}-${mes}-${ano}`;
}
export async function createCertificadoTalksPalestrantes({ titulo, listaNomes, horas = "1", minutos = "30", data}: ITalksProps): Promise<string> {
  const text_dir = talksDirectories.palestrante_content // Arquivo de texto que contém o texto do certificado
  const template_dir = talksDirectories.template // Imagem que contém o template do certificado
  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir})
  if (!response) throw new Error("Erro na criação do certificado!");
  const path_to_certificate: string = response[0]
  return path_to_certificate
}
/**
 * @author Henrique de Paula Rodrigues
 * @description Cria um certificado de participação único
 * @returns {Promise <string>} path do certificado criado
 */
export async function createCompetCertificate({ nome,data_inicio,data_fim,horas_semanais,descricao_certificado,dir_template}:ISingleCertificateProps): Promise<string>{
  const text_dir = buildTXTFileFromModel({nome,data_fim,data_inicio,descricao_certificado,horas_semanais}) // Arquivo de texto que contém o texto do certificado
  const template_dir = dir_template || competDirectories.template // Imagem que contém o template do certificado
  const response = await createCertificate({ data:data_inicio, horas: horas_semanais, data_final: data_fim, listaNomes: nome, template_dir, text_dir ,minutos:"0"})
  if (!response) throw new Error("Erro na criação do certificado!");
  const path_to_certificate: string = response[0]
  return path_to_certificate
}
export async function downloadImage (url:string,dest:string){
  const response = await fetch(url);
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fsPromise.writeFile(path.join(__dirname,dest,"template.png"),buffer,{flag:"w"})
        return dest+"/template.png"
}
export async function deleteImage(img_path:string){
  await fsPromise.unlink(path.join(__dirname,img_path))
}