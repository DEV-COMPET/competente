import path from 'path';
import { google } from 'googleapis';
import dotenv from "dotenv";
import { FormInput, FormItemsId } from '../../typings/talks';
dotenv.config();
const competTalksFormId = '1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w';
const environment = process.env.ENVIRONMENT;
export async function updateTalks(formId: string, titulo: string) {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${environment}.json`),
        scopes: 'https://www.googleapis.com/auth/drive',
    })
    const forms = google.forms({
        version: 'v1',
        auth
    })
    const createResponse = await forms.forms.batchUpdate({
        formId,
        requestBody: {
            requests: [
                {
                    updateItem: {
                        item: {
                            title:"O nome do Evento",
                            questionItem: {
                                question: {
                                    questionId: FormInput.EVENTO,
                                    required: true,
                                    choiceQuestion: {
                                        type: 'RADIO',
                                        options: [{ value: titulo }]
                                    }
                                }
                            },
                            itemId: FormItemsId.EVENTO
                        }, updateMask: "*",
                        location: {
                            index: 1
                        }
                    },
                },
                 {
                    updateFormInfo: {
                        info: {
                            title: titulo,
                            description: "Para que você possa receber o certificado de participação e poder utilizar como horas complementares, precisamos que você insira seus dados de acordo com o presente formulário.\n\nOBS: Os certificados serão entregues ao final do evento"
                        },
                        updateMask: "*"
                    }
                }]
        }
    })
    return createResponse.status
}
