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

    const getNivelOrganizacaoTextStyleArray = getNivelOrganizacaoTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getNivelOrganizacaoTextStyleArray[1];
    content.push(getNivelOrganizacaoTextStyleArray[0]);

    if(iTalksFeedback.nivelOrganizacao) {
      const nivelOrganizacaoStyle = getNivelOrganizacaoList(nextStartIndex, iTalksFeedback.nivelOrganizacao);
      nextStartIndex = nivelOrganizacaoStyle[1];
      content.push(nivelOrganizacaoStyle[0]);
    }

    const getSugestoesTextStyleArray = getSugestoesTextStyle(nextStartIndex, iTalksFeedback);
    nextStartIndex = getSugestoesTextStyleArray[1];
    content.push(getSugestoesTextStyleArray[0]);

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
    const nivelOrganizacaoText = `Nível de organização: ${iTalksFeedback.nivelOrganizacao? `\n${iTalksFeedback.nivelSatisfacao}` : "Não há dados"}`;
    const sugestionsText = `Sugestões: ${iTalksFeedback.sugestoes !== undefined ? `\n${iTalksFeedback.sugestoes}` : "Não há dados"}`;

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
    
    let text = `${title}\n${qntRegistrations}\n${qntCertificateRecipients}\n\n${notaMediaText}\n${relevancia}\n${chanceIndicacao}\n`
    text += `${correspondenciaExpectativa}\n${nivelSatisfacao}\n${nivelOrganizacao}\n\n${sugestionsText}`;    

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
  const endIndex = (n + 1) + (textObject.qntRegistrationsText.length - iTalksFeedback.certifications.toString().length) + 1;

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
  const endIndex = (n + 1) + (textObject.relevanciaText.length - (iTalksFeedback.relevancia?.length !== undefined? iTalksFeedback.relevancia?.length : 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 1,
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + 1];
  console.log(iTalksFeedback.relevancia);

  return arr;
}

function getRelevanciaList(n: number, relevancia: string): CustomListStyleArray {
  const listItems = relevancia.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
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

function getChanceIndicacaoTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 2) + (textObject.chanceIndicacaoText.length - (iTalksFeedback.chanceIndicacao?.length !== undefined? iTalksFeedback.chanceIndicacao?.length : 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 2, // + 2 devido à quebra de linha
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + 3];

  return arr;
}

function getChanceIndicacaoList(n: number, chanceIndicacao: string): CustomListStyleArray {
  const listItems = chanceIndicacao.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
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

function getCorrespondenciaExpectativaTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 2) + (textObject.correspondenciaExpectativaText.length - (iTalksFeedback.correspondenciaExpectativa?.length !== undefined? iTalksFeedback.correspondenciaExpectativa?.length : 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 2, // + 2 devido à quebra de linha
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + 3];

  return arr;
}

function getCorrespondenciaExpectativaList(n: number, correspondenciaExpectativa: string): CustomListStyleArray {
  const listItems = correspondenciaExpectativa.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
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

function getNivelSatisfacaoTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 2) + (textObject.nivelSatisfacaoText.length - (iTalksFeedback.nivelSatisfacao?.length !== undefined? iTalksFeedback.nivelSatisfacao?.length : 0));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 2, // + 2 devido à quebra de linha
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + 3];

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

function getNivelOrganizacaoTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 2) + (textObject.nivelOrganizacaoText.length - (iTalksFeedback.nivelOrganizacao?.length !== undefined? iTalksFeedback.nivelOrganizacao?.length : "Não há dados".length));

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 2, // + 2 devido à quebra de linha
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + "Não há dados".length];

  return arr;
}

function getNivelOrganizacaoList(n: number, nivelOrganizacao: string): CustomListStyleArray {
  const listItems = nivelOrganizacao.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
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

function getSugestoesTextStyle(n: number, iTalksFeedback: ITalksFeedback): CustomStyleArray {
  const textObject = getTextObject(iTalksFeedback);
  const endIndex = (n + 2) + (textObject.sugestionsText.length - (iTalksFeedback.sugestoes?.length !== undefined? iTalksFeedback.sugestoes?.length : "Não há dados".length));
  console.log(textObject.sugestionsText, iTalksFeedback.sugestoes);

  const textStyle = {
    updateTextStyle: {
      textStyle: {
        bold: true,
        fontSize: { magnitude: 12, unit: "PT" }
      },
      range: {
        startIndex: n + 2, // + 2 devido à quebra de linha
        endIndex: endIndex
      },
      fields: "bold,fontSize"
    },
  }

  const arr: CustomStyleArray = [ textStyle, endIndex + 1];

  return arr;
}

function getSugestoesList(n: number, sugestions: string): CustomListStyleArray {
  const listItems = sugestions.split("\n").filter(item => item.trim() !== ""); // Separar itens da string
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