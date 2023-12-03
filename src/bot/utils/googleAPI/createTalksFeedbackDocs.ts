import { google, docs_v1 } from "googleapis";
import { env } from "@/env";
import { GoogleError } from "@/bot/errors/googleError";
import { ResourceNotFoundError } from '@/api/errors/resourceNotFoundError';
import { partial_to_full_path } from "@/bot/utils/json";
import { ITalksFeedback } from "./interfaces";
import { Either, left, right } from '@/api/@types/either';


type CreateTalksFeedbackDocs = Either<
  { error: ResourceNotFoundError | GoogleError | Error },
  { path_to_certificates: string }
>

export async function createDocs(iTalksFeedback : ITalksFeedback): Promise<CreateTalksFeedbackDocs> {
            const auth = new google.auth.GoogleAuth({
                keyFile: partial_to_full_path({
                  dirname: __dirname,
                  partialPath: `../../../utils/googleAPI/competente.${env.ENVIRONMENT}.json`
                }),
                scopes: 'https://www.googleapis.com/auth/drive',
              });

              const docs = google.docs({ version: "v1", auth });

              const document: docs_v1.Schema$Document = await docs.documents.create({
                requestBody: {
                    title: `${iTalksFeedback.event} Talks Feedback Test1`
                },
              });

              const documentId = document.documentId;
              if(!documentId) {
                console.error("Erro ao obter o ID do document");
                return left({ error: new GoogleError("Erro ao obter o ID do document") });
              }

              const content: docs_v1.Schema$Request[] = [{
                insertText: {
                    text: `Feedback do Talks: ${iTalksFeedback.event}\n
                    Quantidade de registros: ${iTalksFeedback.registrations}`,
                    location: {
                        index: 1,
                    }
                }
              }];

              await docs.documents.batchUpdate({
                documentId,
                requestBody: {
                    requests: content,
                }
              });
        }