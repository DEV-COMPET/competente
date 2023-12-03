import { google, docs_v1 } from "googleapis";
import { env } from "@/env";
import { GoogleError } from "@/bot/errors/googleError";
import { ResourceNotFoundError } from '@/api/errors/resourceNotFoundError';
import { partial_to_full_path } from "@/bot/utils/json";
import { ITalksFeedback } from "./interfaces";
import { Either, left, right } from '@/api/@types/either';
import { GaxiosResponse } from "gaxios";

type CreateTalksFeedbackDocs = Either<
  { error: ResourceNotFoundError | GoogleError | Error },
  { document: GaxiosResponse<docs_v1.Schema$Document> }
>;

export async function createDocs(iTalksFeedback: ITalksFeedback): Promise<CreateTalksFeedbackDocs> {
  const auth = new google.auth.GoogleAuth({
    keyFile: partial_to_full_path({
      dirname: __dirname,
      // partialPath: `../../../utils/googleAPI/competente.${env.ENVIRONMENT}.json`
      partialPath: `./competente.${env.ENVIRONMENT}.json`
    }),
    scopes: 'https://www.googleapis.com/auth/documents',
  });

  const docs = google.docs({ version: "v1", auth });

  try {
    const document = await docs.documents.create({
      requestBody: {
        title: `${iTalksFeedback.event} Talks Feedback Test1`,
      },
    });
    

    console.log("create");

    const documentId = document.data.documentId;
    if (!documentId) {
      console.error("Error obtaining document ID");
      return left({ error: new GoogleError("Error obtaining document ID") });
    }

    const title = `Feedback do Talks: ${iTalksFeedback.event}`;
    const qntRegistrations = `Quantidade de registros: ${iTalksFeedback.registrations}`;
    const qntCertificateRecipients = `Quantidade de certificados: ${iTalksFeedback.certifications}`;
    const notaMediaText = `Notas médias de cada pergunta:`;
    const relevancia = `Relevância do evento: ${iTalksFeedback.relevancia? iTalksFeedback.relevancia : "Não há dados"}`;
    const chanceIndicacao = `Chance de indicação: ${iTalksFeedback.chanceIndicacao? iTalksFeedback.chanceIndicacao : "Não há dados"}`;
    const correspondenciaExpectativa = `Correspondência de expectativa: ${iTalksFeedback.correspondenciaExpectativa? iTalksFeedback.correspondenciaExpectativa : "Não há dados"}`;
    const nivelSatisfacao = `Nível de satisfação: ${iTalksFeedback.nivelSatisfacao? iTalksFeedback.nivelSatisfacao : "Não há dados"}`;
    const nivelOrganizacao = `Nível de organização: ${iTalksFeedback.nivelOrganizacao? iTalksFeedback.nivelSatisfacao : "Não há dados"}`;
    
    const sugestionsText = `Sugestões:`;
    
    let text = `${title}\n${qntRegistrations}\n${qntCertificateRecipients}\n\n${notaMediaText}\n${relevancia}\n${chanceIndicacao}\n`
    text += `${correspondenciaExpectativa}\n${nivelSatisfacao}\n${nivelOrganizacao}\n\n${sugestionsText}`;
    
    const sugestions = iTalksFeedback.sugestoes;

    if(sugestions && sugestions.length > 0) {
      text += `\n`
      for(const sugestion of sugestions) {
        text += `${sugestion}\n`
      }
    }
    else
      text += ` Não há sugestões`
    
    const content: docs_v1.Schema$Request[] = [
      {
        insertText: {
          text: text,
          location: {
            index: 1,
          },
        },
      },

      {
        updateTextStyle: {
          textStyle: {
            bold: true,
            underline: true,
            fontSize: { magnitude: 16, unit: "PT" }
          },
          range: {
            startIndex: 1,
            endIndex: 1 + title.length
          },
          fields: "bold,underline,fontSize"
        }
      },

      {
        updateParagraphStyle: {
          paragraphStyle: {
            alignment: "CENTER"
          },
          range: {
            startIndex: 1,
            endIndex: title.length
          },
          fields: "alignment"
        }
      }
    ];

    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: content,
      },
    });

    return right({ document });

  } catch (error: any) {
    console.error("Error creating document:", error.message);
    return left({ error: new GoogleError(`Error creating document: ${error.message}`) });
  }
}
