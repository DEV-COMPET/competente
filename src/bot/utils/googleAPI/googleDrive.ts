import { docs_v1, google } from "googleapis";
import { partial_to_full_path } from "../json";
import fs from "fs"
import { env } from "@/env";
import { Either, left, right } from "@/api/@types/either";
import { GoogleError } from "@/bot/errors/googleError";
import { InvalidEmailError } from "@/bot/errors/invalidEmailError";
import { GaxiosResponse } from "gaxios";

async function createFolder() {
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

export async function uploadToTalksFeedbackFolder(document: GaxiosResponse<docs_v1.Schema$Document>): Promise<UploadToFolderResponse | undefined> {
  const auth = new google.auth.GoogleAuth({
    keyFile: partial_to_full_path({
      dirname: __dirname,
      partialPath: `competente.${env.ENVIRONMENT}.json`
    }),
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  const drive = google.drive({ version: 'v3', auth });

  const folderId = "1LbfvgkitxE68jItkQmSq9X4xAHs5ddo9";

  const fileMetadata = {
    name: `${document.data.title}.docx`,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    parents: [folderId],
  };

  const { data } = await drive.files.export({
    fileId: document.data.documentId!,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  }, { responseType: `stream` });

  const media = {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    body: data
  };

  try {
    // const response = await drive.files.list({
    //   q: "mimeType='application/vnd.google-apps.folder'", // Filtra apenas pastas
    // });

    // const folders = response.data.files;
    
    // if (folders) {
    //   folders.forEach((folder) => {
    //     console.log(`Nome da pasta: ${folder.name}, ID: ${folder.id}`);
    //   });
    // } else {
    //   console.log('Nenhuma pasta encontrada.');
    // }
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (!file.data.id) {
      return left({ error: new GoogleError("Erro na criação do arquivo") })
    }

    return right({ file_id: file.data.id })

  } catch (error: any) {
    return left({ error: new GoogleError(error.message) })
  }
}

export async function uploadToFolder(path_to_certificates: string, folderId: string = "12kwuE0lalYPWzcE6gCyYg0fTdXoT33eh"): Promise<UploadToFolderResponse> {
  const auth = new google.auth.GoogleAuth({
    keyFile: partial_to_full_path({
      dirname: __dirname,
      partialPath: `competente.${env.ENVIRONMENT}.json`
    }),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({ version: 'v3', auth });
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


type removeFromDriveResponse = Either<
    { error: InvalidEmailError},
    { emailData: string[]}
>

export async function removeFromDrive (emailsVerificado: string[]) : Promise<removeFromDriveResponse>{
  const auth = new google.auth.GoogleAuth({ 
      keyFile: partial_to_full_path({
          dirname: __dirname,
          partialPath: `competente.${env.ENVIRONMENT}.json`
      }),
      scopes: 'https://www.googleapis.com/auth/drive',
  });

  const drive = google.drive({version: 'v3', auth});
  const folderId = '0B5QTELWgXQ5DfnY0Snl1Zl9STWF0OEVLTzZKeWlPazNKTnluZTdwLVRTUnJCcmhiOXlFZkk';

  const emailsRemovidos: string[] = [];
  const emailNaoRemovidos: string[] = [];

  const res = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id, emailAddress)',
  });

  const permissions = res?.data.permissions;
  if (permissions && permissions.length) {
      for (const email of emailsVerificado) {
          const userPermission = permissions.find((permissions: any) => permissions.emailAddress === email);
          if (userPermission && userPermission.id) {
              await drive.permissions.delete({
                  fileId: folderId,
                  permissionId: userPermission.id
              })

              emailsRemovidos.push(email);
          } else {
              emailNaoRemovidos.push(email);
          }

      }
  }

  if (emailNaoRemovidos.length > 0) 
      return left({ error: new InvalidEmailError(emailNaoRemovidos, emailsRemovidos, "removidos")});

  return right({ emailData: emailsRemovidos });
}
          
type acessDriveResponse = Either<
  { error: InvalidEmailError},
  { emailData: string[] }
>

export async function acessDrive(email: string): Promise<acessDriveResponse> {
    const auth = new google.auth.GoogleAuth({ 
      keyFile: partial_to_full_path({
          dirname: __dirname,
          partialPath: `competente.${env.ENVIRONMENT}.json`
      }),
      scopes: 'https://www.googleapis.com/auth/drive',
    });

    const drive = google.drive({version: 'v3', auth});
    const folderId = '0B5QTELWgXQ5DfnY0Snl1Zl9STWF0OEVLTzZKeWlPazNKTnluZTdwLVRTUnJCcmhiOXlFZkk';
    const emailAdd: string[] = [];

    const permissions = [
      {
        type: "user",
        role: "writer",
        emailAddress: email
      }
    ]
    for (const permission of permissions) {
      try {
        await drive.permissions.create({
          fileId: folderId,
          sendNotificationEmail: true,
          emailMessage: "Seja bem vindo ao drive do compet",
          requestBody: permission,
          fields: 'id'
        });
        emailAdd.push(email);
      } catch (error) {
        console.log(error)
        return left({ error: new InvalidEmailError([email], [" "], "compartilhar")})
      }
    }
    return right({ emailData: emailAdd })
}