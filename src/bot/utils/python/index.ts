import { PythonShell, PythonShellError } from 'python-shell';
import { execSync } from 'child_process';
import { talksDirectories } from './constants';
import { Either, left, right } from '@/api/@types/either';
import { formatarData } from '../formatting/formatarData';
import { ICreateCertificateProps, ITalksProps } from './interfaces';
import { ResourceNotFoundError } from '@/api/errors/resourceNotFoundError';
import { partial_to_full_path, readJsonFileRequest } from '../json';
import { PythonVenvNotActivatedError } from '@/bot/errors/pythonVenvNotActivatedError';
import fs from 'fs'
import { resizeToPageFormat } from '../pdf/resizePDF';
import { writeFile } from 'fs/promises'; // ou o módulo de arquivo que você estiver usando
import { readPdfFile } from '../pdf/readPDF';

type CreateTalksPdfResponse = Either<
  { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
  { path_to_certificates: string }
>

export async function createTalksPdf({ titulo, listaNomes, horas = "1", minutos = "30", data }: ITalksProps): Promise<CreateTalksPdfResponse> {
  const text_dir = talksDirectories.content // Arquivo de texto que contém o texto do certificado
  const template_dir = talksDirectories.template // Imagem que contém o template do certificado

  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir })

  if (response.isLeft())
    return left({ error: response.value.error })

  return right({ path_to_certificates: response.value.response[0] })
}

type GetPythonPathResponse = Either<
  { error: ResourceNotFoundError },
  { python_path: string }
>

function getPythonPath(): GetPythonPathResponse {
  const isWin = process.platform === "win32";
  const isLinux = process.platform === "linux";

  if (isLinux)
    return right({ python_path: execSync('which python3').toString().trim() })

  if (isWin)
    return right({ python_path: 'python' })

  return left({ error: new ResourceNotFoundError("Operational System for Python") })
}

type CreateCertificateResponse = Either<
  { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
  { response: string[] }
>

export async function createCertificate({
  data, horas, listaNomes, minutos = "0", template_dir, text_dir,
  titulo = "", data_final = formatarData(new Date(Date.now()))
}: ICreateCertificateProps): Promise<CreateCertificateResponse> {
  const aux_args: string[] = [text_dir, template_dir, titulo, data, horas, minutos, data_final];
  const args = aux_args.concat(listaNomes);

  const executePythonScriptResponse = await executePythonScript({
    args, pathRequest: {
      dirname: __dirname,
      partialPath: "script.py"
    }
  })
  if (executePythonScriptResponse.isLeft())
    return left({ error: executePythonScriptResponse.value.error })

  const pdfContent = await readPdfFile(executePythonScriptResponse.value.response[0]);

  const resizedPdf = await resizeToPageFormat(pdfContent);

  await writeFile(executePythonScriptResponse.value.response[0], resizedPdf);

  return right({ response: executePythonScriptResponse.value.response})
}

interface executePythonScriptRequest {
  args?: string[],
  pathRequest: readJsonFileRequest
}

type executePythonScriptResponse = Either<
  { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
  { response: string[] }
>

export async function executePythonScript({ args, pathRequest }: executePythonScriptRequest): Promise<executePythonScriptResponse> {

  if (!args) args = []

  const scriptPath = partial_to_full_path(pathRequest);

  const pythonPathResponse = getPythonPath();
  const pythonPath = pythonPathResponse.isRight() ? pythonPathResponse.value.python_path : "";

  if (pythonPathResponse.isLeft()) {
    return left({ error: pythonPathResponse.value.error });
  }

  const options = { pythonPath, args };

  try {
    const response = await PythonShell.run(scriptPath, options);
    if (!response)
      return left({ error: new PythonShellError() });

    return right({ response });

  } catch (error: any) {
    // console.error(error);
    if (error.message.includes("No module named 'reportlab'") || error.stack.includes("No module named 'reportlab'"))
      return left({ error: new PythonVenvNotActivatedError() });
    return left({ error: error })
  }
}

type createCertificadoTalksPalestrantesResponse = Either<
  { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
  { path_to_certificate: string }
>
// retorna o path do certificado criado
export async function createCertificadoTalksPalestrantes({ titulo, listaNomes, horas = "1", minutos = "30", data }: ITalksProps): Promise<createCertificadoTalksPalestrantesResponse> {
  const text_dir = talksDirectories.palestrante_content // Arquivo de texto que contém o texto do certificado
  const template_dir = talksDirectories.template // Imagem que contém o template do certificado

  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir })
  if (response.isLeft())
    return left({ error: response.value.error })

  return right({ path_to_certificate: response.value.response[0] })
}

