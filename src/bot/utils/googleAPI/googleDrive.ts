import { google } from "googleapis";
import { partial_to_full_path } from "../json";
import fs from "fs"
import { env } from "@/env";
import { Either, left, right } from "@/api/@types/either";
import { GoogleError } from "@/bot/errors/googleError";

async function createFolder() {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const auth = new google.auth.GoogleAuth({
    keyFile: partial_to_full_path({
      dirname: __dirname,
      partialPath: `../../../utils/googleAPI/competente.${env.ENVIRONMENT}.json`
    }),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: 'Invoices',
    mimeType: 'application/vnd.google-apps.folder',
  };
  const file = await service.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  });
  console.log('Folder Id:', file.data.id);
  return file.data.id
}

type UploadToFolderResponse = Either<
  { error: Error },
  { file_id: string }
>

export async function uploadToFolder(path_to_certificates: string): Promise<UploadToFolderResponse> {
  const auth = new google.auth.GoogleAuth({
    keyFile: partial_to_full_path({
      dirname: __dirname,
      partialPath: `competente.${env.ENVIRONMENT}.json`
    }),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({ version: 'v3', auth });

  const folderId = "12kwuE0lalYPWzcE6gCyYg0fTdXoT33eh"
  const fileMetadata = {
    name: path_to_certificates.split('/').pop(),
    parents: [folderId],
  };
  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(path_to_certificates),
  };

  try {

    const file = await service.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (!file.data.id) {
      return left({ error: new GoogleError("Erro na cruação do arquivo") })
    }

    return right({ file_id: file.data.id })

  } catch (error: any) {
    return left({ error: new GoogleError(error.message) })
  }
}
