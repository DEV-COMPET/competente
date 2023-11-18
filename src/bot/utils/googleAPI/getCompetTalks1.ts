import { FormResponseTalks, FormInput, FormInputRegistration } from "../../typings/talks";
import path from 'path';
import { google } from 'googleapis';
import { env } from "@/env";

const competTalksFormId = env.GOOGLE_FORM_ID;
const environment = env.ENVIRONMENT;

type QuestionAnswers = {
  relevancia: string,
  chanceIndicacao: string,
  correspondenciaExpectativa: string,
  nivelSatisfacao: string,
  notaOrganizacao: string,
  sugestao: string
}

type User = {
  createTime: string,
  email: string,
  event: string,
  matricula: string,
  nome: string,
  questionAnswers: QuestionAnswers
}

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

async function getAllCertificateResponses(formID: string): Promise<User[] | null> {
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
    questions = formDefinition.data.items.map(question => ({ questionId: question.questionItem?.question?.questionId, title: question.title }));
  }

  if(data !== undefined) {
    data = data.sort((a, b) => {
      const dateA = new Date(a.lastSubmittedTime).getTime();
      const dateB = new Date(b.lastSubmittedTime).getTime();
      
      return (dateA - dateB);
    });

    // console.log(data[data.length - 1].answers)

    // // console.log(data[2]);

    // console.log(data[data.length - 1].answers['71160225']?.textAnswers)
    // console.log(data[data.length - 1].answers['15086fcb']?.textAnswers)
    // console.log(data[data.length - 1].answers['69f30e2c']?.textAnswers)
    // console.log(data[data.length - 1].answers['0e4af06f']?.textAnswers)
    // console.log(data[data.length - 1].answers['5449dcbb']?.textAnswers)
    // console.log(data[data.length - 1].answers['7e428446']?.textAnswers)
    // console.log(data[data.length - 1].answers['459eff55']?.textAnswers)
    // console.log(data[data.length - 1].answers['1b4928e1']?.textAnswers)
    // console.log(data[data.length - 1].answers['3ee1b434']?.textAnswers)

  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const event: string = form.answers[FormInput.EVENTO]?.textAnswers.answers[0].value
    const nome: string = form.answers[FormInput.NOME]?.textAnswers.answers[0].value
    const email: string = form.answers[FormInput.EMAIL]?.textAnswers.answers[0].value
    const matricula: string = form.answers[FormInput.MATRICULA]?.textAnswers.answers[0].value
    const createTime: string = form.createTime
    const questionAnswers = { relevancia: form.answers[FormInput.RELEVANCIA_TEMA]?.textAnswers.answers[0].value,
                            chanceIndicacao: form.answers[FormInput.CHANCE_INDICAR]?.textAnswers.answers[0].value,
                            correspondenciaExpectativa: form.answers[FormInput.CORRESPONDENCIA_EXPECTATIVAS]?.textAnswers.answers[0].value,
                            nivelSatisfacao: form.answers[FormInput.NIVEL_SATISFACAO]?.textAnswers.answers[0].value,
                            notaOrganizacao: form.answers[FormInput.NOTA_ORGANIZACAO]?.textAnswers.answers[0].value,
                            sugestao: form.answers[FormInput.SUGESTAO]?.textAnswers.answers[0].value }
    const certificado = { nome, email, event, matricula, createTime, questionAnswers }
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

export async function getAllAnswersGrade(eventName: string): Promise<QuestionAnswers[] | null> {
  const certificateFormID = "1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w";
  const recipients = await getAllCertificateResponses(certificateFormID);

  if(recipients !== null) {
    const eventCertificateRecipients = recipients.filter(registration => clearString(registration.event?.toLowerCase()) === clearString(eventName.toLowerCase()));
    const answersGrade = eventCertificateRecipients.map(recipient => ({ ...recipient.questionAnswers }));
    return answersGrade;
  }
  return null;
}

export async function getAverageGradeOfEachQuestion(eventName: string): Promise<void> {
  const answersGrade = await getAllAnswersGrade(eventName);

  const averageGrade: {
    relevancia: number,
    chanceIndicacao: number,
    correspondenciaExpectativa?: number,
    nivelSatisfacao: number,
    notaOrganizacao: number,
    sugestao?: number
  } = { relevancia: 0, chanceIndicacao: 0, correspondenciaExpectativa: 0, nivelSatisfacao: 0,
        notaOrganizacao: 0 };

  if (answersGrade) {
    answersGrade.forEach(recipient => {
      const answers: (keyof QuestionAnswers)[] = Object.keys(recipient) as (keyof QuestionAnswers)[];
      answers.filter(answer => Object.keys(averageGrade).includes(answer))

      for (const answer of answers) {
        const value = Number(recipient[answer]);

        averageGrade[answer] = (Number(averageGrade[answer]) ?? 0) + value;
      }
    });

    // Calcular a média
    const numberOfResponses = answersGrade.length;

    for (const key of Object.keys(averageGrade) as (keyof typeof averageGrade)[]) {
      averageGrade[key] = averageGrade[key]! / numberOfResponses;
    }
  }
  console.log(averageGrade);
}


function clearString(str: string): string {
  if(str === undefined) return str;

  // Remover caracteres especiais no início e no final
  let resultado = str.replace(/^[^\w\s]+|[^\w\s]+$/g, '');

  // Remover espaços extras no meio da string
  resultado = resultado.replace(/\s+/g, ' ');

  return resultado.trim();
}