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
    const title = `Feedback de ${iTalksFeedback.event}`;
    const document = await docs.documents.create({
      requestBody: {
        title: `${title}`,
      },
    });

    const documentId = document.data.documentId;
    if (!documentId) {
      console.error("Error obtaining document ID");
      return left({ error: new GoogleError("Error obtaining document ID") });
    }

    console.log(title, "\n")
    const text = getText(iTalksFeedback, title);
    
    const content: docs_v1.Schema$Request[] = [
      {
        insertText: {
          text: text,
          location: {
            index: 1,
          },
        },
      },

      // {
      //   updateTextStyle: {
      //     textStyle: {
      //       bold: true,
      //       underline: true,
      //       fontSize: { magnitude: 16, unit: "PT" }
      //     },
      //     range: {
      //       startIndex: 1,
      //       endIndex: 1 + title.length
      //     },
      //     fields: "bold,underline,fontSize"
      //   }
      // },

      // {
      //   updateParagraphStyle: {
      //     paragraphStyle: {
      //       alignment: "CENTER"
      //     },
      //     range: {
      //       startIndex: 1,
      //       endIndex: title.length
      //     },
      //     fields: "alignment"
      //   }
      // },

      // {
      //   updateTextStyle: {
      //     textStyle: {
      //       bold: true,
      //     },
      //     range: {
      //       startIndex: title.length + 1,
      //       endIndex: (title.length + 1) + qntRegistrations.length
      //     },
      //     fields: "bold,underline,fontSize"
      //   }
      // }, 

      // {
      //   updateTextStyle: {
      //     textStyle: {
      //       bold: true,
      //     },
      //     range: {
      //       startIndex: (title.length + 1 + qntRegistrations.length) + 2,
      //       endIndex: (title.length + 1 + qntRegistrations.length) + qntCertificateRecipients.length
      //     },
      //     fields: "bold,underline,fontSize"
      //   }
      // }
    ];

    content.push(getTitleStyle(title));
    content.push(getTextAlignment(title));

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


function getText(iTalksFeedback: ITalksFeedback, title: string): string {
    const qntRegistrations = `Quantidade de registros: ${iTalksFeedback.registrations}`;
    const qntCertificateRecipients = `Quantidade de certificados: ${iTalksFeedback.certifications}`;
    const notaMediaText = `Notas médias de cada pergunta:`;
    const relevancia = `Relevância do evento: ${iTalksFeedback.relevancia? `\n${iTalksFeedback.relevancia}` : "Não há dados"}`;
    const chanceIndicacao = `Chance de indicação: ${iTalksFeedback.chanceIndicacao? `\n${iTalksFeedback.chanceIndicacao}` : "Não há dados"}`;
    const correspondenciaExpectativa = `Correspondência de expectativa: ${iTalksFeedback.correspondenciaExpectativa? `\n${iTalksFeedback.correspondenciaExpectativa}` : "Não há dados"}`;
    const nivelSatisfacao = `Nível de satisfação: ${iTalksFeedback.nivelSatisfacao? `\n${iTalksFeedback.nivelSatisfacao}` : "Não há dados"}`;
    const nivelOrganizacao = `Nível de organização: ${iTalksFeedback.nivelOrganizacao? `\n${iTalksFeedback.nivelSatisfacao}` : "Não há dados"}`;
    
    const sugestionsText = `Sugestões:`;
    
    let text = `${title}\n${qntRegistrations}\n${qntCertificateRecipients}\n\n${notaMediaText}\n${relevancia}\n${chanceIndicacao}\n`
    text += `${correspondenciaExpectativa}\n${nivelSatisfacao}\n${nivelOrganizacao}\n\n${sugestionsText}`;
    
    const sugestions = iTalksFeedback.sugestoes;

    if(sugestions === undefined) {
      text += `Nenhuma sugestão`
    }
    else
      text += `\n${sugestions}`;

    return text;
}

function getTextAlignment(title: string) {
  const alignment = {
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

  return alignment;
}

function getTitleStyle(title: string) {
  console.log(title)

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        underline: true,
        fontSize: { magnitude: 16, unit: "PT" }
      },
      range: {
        startIndex: 1,
        endIndex: title.length + 1
      },
      fields: "bold,underline,fontSize"
    }
  }

  return textStyle;
}

function getQntRegistrationsStyle() {
  
}