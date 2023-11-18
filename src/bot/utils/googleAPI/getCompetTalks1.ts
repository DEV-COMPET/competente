import { FormResponseTalks, FormInput, FormInputRegistration } from "../../typings/talks";
import path from 'path';
import { google } from 'googleapis';
import { env } from "@/env";

const competTalksFormId = env.GOOGLE_FORM_ID;
const environment = env.ENVIRONMENT;

async function getAllRegistrations(formID: string): Promise<FormResponseTalks[]> {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, `competente.${environment}.json`),
    scopes: 'https://www.googleapis.com/auth/forms.responses.readonly',
  })
  const forms = google.forms({
    version: 'v1',
    auth: auth,
  });
  const res = await forms.forms.responses.list({
    formId: formID,
  });
  let data: Array<any> | undefined = res.data.responses;


  if(data !== undefined) {
    data = data.sort((a, b) => {
      const dateA = new Date(a.lastSubmittedTime).getTime();
      const dateB = new Date(b.lastSubmittedTime).getTime();
      
      return (dateA - dateB);
    });

  }


  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const event: string = form.answers[FormInputRegistration.EVENTO]?.textAnswers.answers[0].value
    const nome: string = form.answers[FormInputRegistration.NOME]?.textAnswers.answers[0].value
    const email: string = form.answers[FormInputRegistration.EMAIL]?.textAnswers.answers[0].value
    const matricula: string = form.answers[FormInputRegistration.MATRICULA]?.textAnswers.answers[0].value
    const createTime: string = form.createTime
    const certificado = { nome, email, event, matricula, createTime }
    return certificado
  });
  return certificados;
}

async function getAllCertificateResponses(formID: string): Promise<FormResponseTalks[] | null> {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, `competente.${environment}.json`),
    scopes: [
      'https://www.googleapis.com/auth/forms.responses.readonly',
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/forms.body.readonly',
    ],
  })
  const forms = google.forms({
    version: 'v1',
    auth: auth,
  });
  const res = await forms.forms.responses.list({
    formId: formID,
  });

  // Obter a definição do formulário para obter as perguntas
  const formDefinition = await forms.forms.get({
    formId: formID,
  });

  let data: Array<any> | undefined = res.data.responses

  let questions;

  if(formDefinition.data.items) {
    questions = formDefinition.data.items.map(question => ({ itemId: question.itemId, title: question.title }));
    console.log(questions);
  }

  if(data !== undefined) {
    data = data.sort((a, b) => {
      const dateA = new Date(a.lastSubmittedTime).getTime();
      const dateB = new Date(b.lastSubmittedTime).getTime();
      
      return (dateA - dateB);
    });

    console.log(data[data.length - 1].answers['71160225'].textAnswers)

    // console.log(data[2]);

    // console.log(data[2].answers['5d803f51']?.textAnswers)
    // console.log(data[2].answers['11bba088']?.textAnswers)
    // console.log(data[2].answers['2d1576f5']?.textAnswers)
    // console.log(data[2].answers['502f0672']?.textAnswers)
    // console.log(data[2].answers['55bb4b1f']?.textAnswers)

  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const event: string = form.answers[FormInput.EVENTO]?.textAnswers.answers[0].value
    const nome: string = form.answers[FormInput.NOME]?.textAnswers.answers[0].value
    const email: string = form.answers[FormInput.EMAIL]?.textAnswers.answers[0].value
    const matricula: string = form.answers[FormInput.MATRICULA]?.textAnswers.answers[0].value
    const createTime: string = form.createTime
    const certificado = { nome, email, event, matricula, createTime }
    return certificado
  });
  return certificados;
  }
  return null;
}

export async function getCompetTalksRegistration(talksEventName: string): Promise<FormResponseTalks[]> {
  const registrations = await getAllRegistrations(competTalksFormId);

  // O código abaixo remove os caracteres especiais
  const eventRegistrations = registrations.filter(registration => registration.event === talksEventName)
  // console.log(eventRegistrations);
  if (eventRegistrations.length === 0) throw new Error(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`)
  return eventRegistrations
}

export async function getCompetTalksEligibleCertificateRecipients(talksEventName: string): Promise<FormResponseTalks[] | null > {
  const certificateFormID = "1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w";
  const recipients = await getAllCertificateResponses(certificateFormID);

  // recipients?.forEach(recipient => console.log(recipient.event?.toLowerCase(), talksEventName.toLowerCase(), recipient.event?.toLowerCase() === talksEventName.toLowerCase(), '\n'));

  if(recipients !== null) {
    const eventCertificateRecipients = recipients.filter(registration => clearString(registration.event?.toLowerCase()) === clearString(talksEventName.toLowerCase()));
    if (eventCertificateRecipients.length === 0) throw new Error(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`);
    return eventCertificateRecipients;
  }
  else return null;
}

// export async function getAllAnswersGrade(eventName: string): Promise<void> {
//   const certificateFormID = "1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w";
//   const recipients = await getAllCertificateResponses(certificateFormID);

//   if(recipients !== null) {
//     const eventCertificateRecipients = recipients.filter(registration => clearString(registration.event?.toLowerCase()) === clearString(eventName.toLowerCase()));

//     eventCertificateRecipients.forEach(recipient => {
//       console.log(recipient)
//     })
//   }
// }

function clearString(str: string): string {
  if(str === undefined) return str;

  // Remover caracteres especiais no início e no final
  let resultado = str.replace(/^[^\w\s]+|[^\w\s]+$/g, '');

  // Remover espaços extras no meio da string
  resultado = resultado.replace(/\s+/g, ' ');

  return resultado.trim();
}