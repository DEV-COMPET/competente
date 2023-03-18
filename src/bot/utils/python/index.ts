import { PythonShell } from 'python-shell';
import path from 'path';
// caminho para o arquivo script.py
const scriptPath = path.resolve(__dirname, "script.py");
interface ICreateCertificateProps {
  text_dir: string,
  template_dir: string,
  titulo: string,
  data: string,
  horas: string,
  minutos: string,
  listaNomes: string[]
}
interface ITalksProps {
  titulo: string,
  listaNomes: string[]
  horas?: string,
  minutos?: string
  data: string
}
async function createCertificate({
  data,
  horas,
  listaNomes,
  minutos,
  template_dir,
  text_dir,
  titulo }: ICreateCertificateProps
): Promise<any[] | undefined> {
  const aux_args: string[] = [];
  aux_args.push(text_dir, template_dir, titulo, data, horas, minutos)
  const args = aux_args.concat(listaNomes);
  const options = {
    pythonPath: 'python',
    args
  }
  try {
    const response = await PythonShell.run(scriptPath, options);
    return response

  } catch (error) {
    console.log(error);

  }
}
export async function createTalksPdf({ titulo, listaNomes, horas = "1", minutos = "30", data }: ITalksProps): Promise<string> {
  const text_dir = "talks_content.txt" // Arquivo de texto que contém o texto do certificado
  const template_dir = "talks_template.png" // Imagem que contém o template do certificado
  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir })
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
