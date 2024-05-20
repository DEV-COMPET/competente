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

interface CustomStyleArray {
  0: {
      updateTextStyle: {
          textStyle: {
              bold?: boolean;
              underline?: boolean;
              fontSize?: {
                  magnitude: number;
                  unit?: string;
              };
          };
          range: {
              startIndex: number;
              endIndex: number;
          };
          fields: string;
      };
  };
  1: number;
}
interface CustomListStyleArray {
  0: {
    createParagraphBullets: {
      range: {
        startIndex: number,
        endIndex: number,
      },
      bulletPreset: string
    }
  },
  1: number;
}


export async function createDocs(iTalksFeedback: ITalksFeedback): Promise<CreateTalksFeedbackDocs> {
  const auth = new google.auth.GoogleAuth({
    keyFile: partial_to_full_path({
      dirname: __dirname,
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
    ];

    const titleStyleArray = getTitleStyle(title);
    let nextStartIndex: number = titleStyleArray[1];  
    content.push(titleStyleArray[0]);
    content.push(getTextAlignment(title));

    const qntRegistrationsArray = getQntRegistrationsStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = qntRegistrationsArray[1];
    content.push(qntRegistrationsArray[0]);

    const qntCertificationsArray = getQntCertificationsStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = qntCertificationsArray[1];
    content.push(qntCertificationsArray[0]);

    const notaMediaTextArray = getNotaMediaTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = notaMediaTextArray[1];
    content.push(notaMediaTextArray[0]);

    const getRelevanciaTextStyleArray = getRelevanciaTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getRelevanciaTextStyleArray[1];
    content.push(getRelevanciaTextStyleArray[0]);

    if(iTalksFeedback.relevancia) {
      const relevanciaListStyle = getRelevanciaList(nextStartIndex, iTalksFeedback.relevancia);
      nextStartIndex = relevanciaListStyle[1];
      content.push(relevanciaListStyle[0]);
    }

    const getChanceIndicacaoTextStyleArray = getChanceIndicacaoTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getChanceIndicacaoTextStyleArray[1];
    content.push(getChanceIndicacaoTextStyleArray[0]);

    if(iTalksFeedback.chanceIndicacao) {
      const chanceIndicacaoStyle = getChanceIndicacaoList(nextStartIndex, iTalksFeedback.chanceIndicacao);
      nextStartIndex = chanceIndicacaoStyle[1];
      content.push(chanceIndicacaoStyle[0]);
    }

    const getCorrespondenciaExpectativaTextStyleArray = getCorrespondenciaExpectativaTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getCorrespondenciaExpectativaTextStyleArray[1];
    content.push(getCorrespondenciaExpectativaTextStyleArray[0]);

    if(iTalksFeedback.correspondenciaExpectativa) {
      const correspondenciaExpectativaStyle = getCorrespondenciaExpectativaList(nextStartIndex, iTalksFeedback.correspondenciaExpectativa);
      nextStartIndex = correspondenciaExpectativaStyle[1];
      content.push(correspondenciaExpectativaStyle[0]);
    }

    const getNivelSatisfacaoTextStyleArray = getNivelSatisfacaoTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getNivelSatisfacaoTextStyleArray[1];
    content.push(getNivelSatisfacaoTextStyleArray[0]);

    if(iTalksFeedback.nivelSatisfacao) {
      const nivelSatisfacaoStyle = getNivelSatisfacaoList(nextStartIndex, iTalksFeedback.nivelSatisfacao);
      nextStartIndex = nivelSatisfacaoStyle[1];
      content.push(nivelSatisfacaoStyle[0]);
    }

    const getNotaOrganizacaoTextStyleArray = getNotaOrganizacaoTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getNotaOrganizacaoTextStyleArray[1];
    content.push(getNotaOrganizacaoTextStyleArray[0]);

    if(iTalksFeedback.notaOrganizacao) {
      const notaOrganizacaoStyle = getNotaOrganizacaoList(nextStartIndex, iTalksFeedback.notaOrganizacao);
      nextStartIndex = notaOrganizacaoStyle[1];
      content.push(notaOrganizacaoStyle[0]);
    }

    // const getSugestoesTextStyleArray = getSugestoesTextStyle(nextStartIndex, iTalksFeedback);
    // nextStartIndex = getSugestoesTextStyleArray[1];
    // content.push(getSugestoesTextStyleArray[0]);

    if(iTalksFeedback.sugestoes) {
      const getSugestoesStyle = getSugestoesList(nextStartIndex, iTalksFeedback.sugestoes);
      nextStartIndex = getSugestoesStyle[1];
      content.push(getSugestoesStyle[0]);
    }



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

function getTextObject(iTalksFeedback: ITalksFeedback) {
    const qntRegistrationsText = `Quantidade de registros: ${iTalksFeedback.registrations}`;
    const qntCertificateRecipientsText = `Quantidade de certificados: ${iTalksFeedback.certifications}`;
    const notaMediaText = `Notas médias de cada pergunta:`;
    const relevanciaText = `Relevância do evento: ${iTalksFeedback.relevancia? `\n${iTalksFeedback.relevancia}` : "Não há dados"}`;
    const chanceIndicacaoText = `Chance de indicação: ${iTalksFeedback.chanceIndicacao? `\n${iTalksFeedback.chanceIndicacao}` : "Não há dados"}`;
    const correspondenciaExpectativaText = `Correspondência de expectativa: ${iTalksFeedback.correspondenciaExpectativa? `\n${iTalksFeedback.correspondenciaExpectativa}` : "Não há dados"}`;
    const nivelSatisfacaoText = `Nível de satisfação: ${iTalksFeedback.nivelSatisfacao? `\n${iTalksFeedback.nivelSatisfacao}` : "Não há dados"}`;
    const nivelOrganizacaoText = `Nível de organização: ${iTalksFeedback.notaOrganizacao? `\n${iTalksFeedback.notaOrganizacao}` : "Não há dados"}`;
    const sugestionsText = `Sugestões: ${iTalksFeedback.sugestoes !== undefined ? `\n${iTalksFeedback.sugestoes}` : "\nNão há dados"}`;


    return { qntRegistrationsText, qntCertificateRecipientsText, notaMediaText, relevanciaText, chanceIndicacaoText, correspondenciaExpectativaText, nivelOrganizacaoText, nivelSatisfacaoText, sugestionsText }
}

function getText(iTalksFeedback: ITalksFeedback, title: string): string {
    const objectText = getTextObject(iTalksFeedback);
    const qntRegistrations = objectText.qntRegistrationsText;
    const qntCertificateRecipients = objectText.qntCertificateRecipientsText;
    const notaMediaText = objectText.notaMediaText;
    const relevancia = objectText.relevanciaText;
    const chanceIndicacao = objectText.chanceIndicacaoText;
    const correspondenciaExpectativa = objectText.correspondenciaExpectativaText;
    const nivelSatisfacao = objectText.nivelSatisfacaoText;
    const nivelOrganizacao = objectText.nivelOrganizacaoText;
    const sugestionsText = objectText.sugestionsText;

    let finalRelevancia: string = relevancia;
    let finalChanceIndicacao: string = chanceIndicacao;
    let finalCorrespondenciaExpectativa: string = correspondenciaExpectativa;
    let finalNivelSatisfacao: string = nivelSatisfacao;
    let finalNivelOrganizacao: string = nivelOrganizacao;
    let finalSugestionsText: string = sugestionsText;

    if(relevancia.endsWith("\n")) {
      finalRelevancia = relevancia.slice(0, relevancia.length - "\n".length);
    }
    if(chanceIndicacao.endsWith("\n")) {
      finalChanceIndicacao = chanceIndicacao.slice(0, chanceIndicacao.length - "\n".length);
    }
    if(correspondenciaExpectativa.endsWith("\n")) {
      finalCorrespondenciaExpectativa = correspondenciaExpectativa.slice(0, correspondenciaExpectativa.length - "\n".length);
    }
    if(nivelSatisfacao.endsWith("\n")) {
      finalNivelSatisfacao = nivelSatisfacao.slice(0, nivelSatisfacao.length - "\n".length);
    }
    if(nivelOrganizacao.endsWith("\n")) {
      finalNivelOrganizacao = nivelOrganizacao.slice(0, nivelOrganizacao.length - "\n".length);
    }
    if(sugestionsText.endsWith("\n")) {
      finalSugestionsText = sugestionsText.slice(0, sugestionsText.length - "\n".length);
    }

    let text = `${title}\n${qntRegistrations}\n${qntCertificateRecipients}\n\n${notaMediaText}\n${finalRelevancia}\n${finalChanceIndicacao}\n`
    text += `${finalCorrespondenciaExpectativa}\n${finalNivelSatisfacao}\n${finalNivelOrganizacao}\n${finalSugestionsText}`;    

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

function getTitleStyle(title: string): CustomStyleArray {
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
    },
  }

  const arr : CustomStyleArray = [ textStyle, title.length + 1 ];

  return arr;
}

function getQntRegistrationsStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 1) + (textObject.qntRegistrationsText.length - iTalksFeedback.registrations.toString().length);

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 14, unit: "PT" }
      },
      range: {
        startIndex: n + 1,
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + iTalksFeedback.registrations.toString().length ];

  return arr;
}

function getQntCertificationsStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 1) + (textObject.qntRegistrationsText.length - iTalksFeedback.certifications.toString().length) + 2;

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 14, unit: "PT" }
      },
      range: {
        startIndex: n + 1,
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + iTalksFeedback.registrations.toString().length  + 1];

  return arr;
}

function getNotaMediaTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 1) + (textObject.notaMediaText.length + 1);

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 14, unit: "PT" }
      },
      range: {
        startIndex: n + 1,
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + 1];

  return arr;
}

function getRelevanciaTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = n + (textObject.relevanciaText.length - (iTalksFeedback.relevancia?.length !== undefined? iTalksFeedback.relevancia?.length: 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n,
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + (!iTalksFeedback.relevancia?.includes("Não há dados")? 3 : 0)];

  return arr;
}

function getRelevanciaList(n: number, relevancia: string): CustomListStyleArray {
  const listItems = relevancia.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
  const totalLengthItems: number = listItems.reduce((acc, item) => acc += item.length, 0);
  const endIndex = n + totalLengthItems - 1;
    
  const listParagraph = {
    createParagraphBullets: {
      range: {
        startIndex: n,
        endIndex: n + totalLengthItems - 1,
      },
      bulletPreset: "BULLET_DISC_CIRCLE_SQUARE"
    }
  }

  return [ listParagraph, endIndex ];
}

function getChanceIndicacaoTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  // const endIndex = (n) + (textObject.chanceIndicacaoText.length - (iTalksFeedback.chanceIndicacao?.length !== undefined? iTalksFeedback.chanceIndicacao?.length : 0));
  const endIndex = n + "Chance de indicação:".length

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 1,
        endIndex: endIndex + 2
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + (!iTalksFeedback.chanceIndicacao?.includes("Não há dados")? 3 : 0) ];

  return arr;
}

function getChanceIndicacaoList(n: number, chanceIndicacao: string): CustomListStyleArray {
  const listItems = chanceIndicacao.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
  const totalLengthItems: number = listItems.reduce((acc, item) => acc += item.length, 0);
  const endIndex = n + totalLengthItems;
    
  const listParagraph = {
    createParagraphBullets: {
      range: {
        startIndex: n + 4,
        endIndex: n + totalLengthItems,
      },
      bulletPreset: "BULLET_DISC_CIRCLE_SQUARE"
    }
  }

  return [ listParagraph, endIndex ];
}

function getCorrespondenciaExpectativaTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n) + (textObject.correspondenciaExpectativaText.length - (iTalksFeedback.correspondenciaExpectativa?.length !== undefined? iTalksFeedback.correspondenciaExpectativa?.length : 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 4, // + 2 devido à quebra de linha
        endIndex: endIndex + 2
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + (!iTalksFeedback.correspondenciaExpectativa?.includes("Não há dados")? 1 : "Não há dados".length)];

  return arr;
}

function getCorrespondenciaExpectativaList(n: number, correspondenciaExpectativa: string): CustomListStyleArray {
  const listItems = correspondenciaExpectativa.split("\n").filter(item => item.trim() !== ""); // Separar itens da string

  const totalLengthItems: number = listItems.reduce((acc, item) => acc += item.length, 0);

  const endIndex = n + totalLengthItems - (correspondenciaExpectativa.includes("Não há dados") === true? 9 : -1) + 2;
    
  const listParagraph = {
    createParagraphBullets: {
      range: {
        startIndex: n + 4,
        endIndex: endIndex,
      },
      bulletPreset: "BULLET_DISC_CIRCLE_SQUARE"
    }
  }

  return [ listParagraph, endIndex - (correspondenciaExpectativa.includes("Não há dados") === true? 2 : 0) ];
}

function getNivelSatisfacaoTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n) + (textObject.nivelSatisfacaoText.length - (iTalksFeedback.nivelSatisfacao?.length !== undefined? iTalksFeedback.nivelSatisfacao?.length : 0)) + 1;

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 3, // + 2 devido à quebra de linha
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + (iTalksFeedback.nivelSatisfacao?.length !== undefined? 3 : "Não há dados".length)];

  return arr;
}

function getNivelSatisfacaoList(n: number, nivelSatisfacao: string): CustomListStyleArray {
  const listItems = nivelSatisfacao.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
  const totalLengthItems: number = listItems.reduce((acc, item) => acc += item.length, 0);
  const endIndex = n + totalLengthItems;
    
  const listParagraph = {
    createParagraphBullets: {
      range: {
        startIndex: n,
        endIndex: n + totalLengthItems,
      },
      bulletPreset: "BULLET_DISC_CIRCLE_SQUARE"
    }
  }

  return [ listParagraph, endIndex ];
}

function getNotaOrganizacaoTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n) + (textObject.nivelOrganizacaoText.length - (iTalksFeedback.notaOrganizacao?.length !== undefined? iTalksFeedback.notaOrganizacao?.length : 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + (iTalksFeedback.notaOrganizacao?.includes("Não há dados")? 0 : 2),
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex ];

  return arr;
}

function getNotaOrganizacaoList(n: number, nivelOrganizacao: string): CustomListStyleArray {
  const listItems = nivelOrganizacao.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
  const totalLengthItems: number = listItems.reduce((acc, item) => acc += item.length, 0);
  const endIndex = n + totalLengthItems;
    
  const listParagraph = {
    createParagraphBullets: {
      range: {
        startIndex: n + 5,
        endIndex: n + totalLengthItems,
      },
      bulletPreset: "BULLET_DISC_CIRCLE_SQUARE"
    }
  }

  return [ listParagraph, endIndex ];
}

function getSugestoesTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n) + "Sugestões".length;

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 6, // TODO: TESTAR
        endIndex: endIndex + 4
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex ];

  return arr;
}

function getSugestoesList(n: number, sugestions: string): CustomListStyleArray {
  const listItems = sugestions.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
  const totalLengthItems: number = listItems.reduce((acc, item) => acc += item.length, 0);
  const endIndex = n + totalLengthItems;
    
  const listParagraph = {
    createParagraphBullets: {
      range: {
        startIndex: n + "Sugestões\n".length + 9,
        endIndex: endIndex + 9,
      },
      bulletPreset: "BULLET_DISC_CIRCLE_SQUARE"
    }
  }

  
  return [ listParagraph, endIndex ];
}