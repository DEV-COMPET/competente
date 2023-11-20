import { talksDirectories } from './constants';
import { Either, left, right } from '@/api/@types/either';
import { formatarData } from '../formatting/formatarData';
import { ICreateCertificateProps, ITalksProps } from './interfaces';
import { ResourceNotFoundError } from '@/api/errors/resourceNotFoundError';
import { partial_to_full_path, readJsonFileRequest } from '../json';
import fs from 'fs';
import { resizeToPageFormat } from '../pdf/resizePDF';
import { writeFile } from 'fs/promises';
import path from 'path';

type CreateTalksPdfResponse = Either<{ error: ResourceNotFoundError | Error }, { path_to_certificates: string }>;

export async function createTalksPdf({ titulo, listaNomes, horas = "1", minutos = "30", data }: ITalksProps): Promise<CreateTalksPdfResponse> {
  const text_dir = talksDirectories.content; // Arquivo de texto que contém o texto do certificado
  const template_dir = talksDirectories.template; // Imagem que contém o template do certificado

  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir });

  if (response.isLeft()) return left({ error: response.value.error });

  return right({ path_to_certificates: response.value.response[0] });
}

type CreateCertificateResponse = Either<
  { error: ResourceNotFoundError | Error }, 
  { response: string[] }
  >;

import { gerarPdf } from './script'; // Ajuste o caminho conforme necessário

export async function createCertificate({
  data,
  horas,
  listaNomes,
  minutos = "0",
  template_dir,
  text_dir,
  titulo = "",
  data_final = formatarData(new Date(Date.now())),
}: ICreateCertificateProps): Promise<CreateCertificateResponse> {
  try {

    console.dir({listaNomes})

    // Chame a função gerarPdf com os argumentos necessários
    const certificateFilePath = await gerarPdf({
      data,
      hora: horas,
      reader: Array.isArray(listaNomes) ? listaNomes : [listaNomes],
      minutos,
      txtName: text_dir,
      evento: titulo,
      dataFinal: data_final,
      imageName: template_dir
    });

    // Retorne o caminho do arquivo do certificado
    return right({ response: [certificateFilePath] });
  } catch (error: unknown) {
    if (error instanceof ResourceNotFoundError || error instanceof Error) {
      return left({ error });
    }
    throw error;
  }
}

type createCertificadoTalksPalestrantesResponse = Either<
  { error: ResourceNotFoundError | Error },
  { path_to_certificate: string }
>;

export async function createCertificadoTalksPalestrantes({
  titulo,
  listaNomes,
  horas = "1",
  minutos = "30",
  data,
}: ITalksProps): Promise<createCertificadoTalksPalestrantesResponse> {
  const text_dir = path.resolve(__dirname, 'talks/talks_palestrante_content.txt'); // Arquivo de texto que contém o texto do certificado
  const template_dir = talksDirectories.template; // Imagem que contém o template do certificado

  const response = await createCertificate({ data, titulo, horas, minutos, listaNomes, template_dir, text_dir });
  if (response.isLeft()) return left({ error: response.value.error });

  return right({ path_to_certificate: response.value.response[0] });
}
