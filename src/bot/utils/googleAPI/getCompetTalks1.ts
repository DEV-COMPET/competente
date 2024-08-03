import { FormResponseTalks, FormInput, FormInputRegistration } from "../../typings/talks";
import path from 'path';
import { google } from 'googleapis';
import { env } from "@/env";

const competTalksFormId = env.GOOGLE_FORM_ID;
const environment = env.ENVIRONMENT;

type OpenQuestionAnswers = {
  sugestao: string
}

export type ClosedQuestionAnswers = {
  relevancia: number,
  chanceIndicacao: number,
  correspondenciaExpectativa: number,
  nivelSatisfacao: number,
  notaOrganizacao: number
}

type AnswersFrequency = {
  relevancia: number[],
  chanceIndicacao: number[],
  correspondenciaExpectativa: number[],
  nivelSatisfacao: number[],
  notaOrganizacao: number[]
}

type QuestionAnswers = {
  openQuestionAnswers: OpenQuestionAnswers;
  closedQuestionAnswers: ClosedQuestionAnswers;
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
  const res = await getRegistrationFormsResponses(formID);

  const data: Array<any> | undefined = res.data.responses;

  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const { event, nome, email, matricula, createTime } = getRegistrationAttributes(form);
    const certificado = { nome, email, event, matricula, createTime };

    return certificado
  });

  return certificados;
}

async function getAllCertificateResponses(formID: string): Promise<User[] | null> {
  const res = await getCertificateFormsResponses(formID);

  const data: Array<any> | undefined = res.data.responses;

  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const { nome, email, event, matricula, createTime, questionAnswers } = getCertificateRecipientAttributes(form);
    const certificado = { nome, email, event, matricula, createTime, questionAnswers };
    return certificado
  });

  return certificados;
}

export async function getCompetTalksRegistration(talksEventName: string): Promise<FormResponseTalks[]> {
  const registrations = await getAllRegistrations(competTalksFormId);
  const eventRegistrations = registrations.filter(registration => registration.event === talksEventName);

  if (eventRegistrations.length === 0) throw new Error(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`)
  return eventRegistrations
}

export async function getCompetTalksEligibleCertificateRecipients(talksEventName: string): Promise<FormResponseTalks[] | null > {
  const certificateFormID = "1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w";
  const recipients = await getAllCertificateResponses(certificateFormID);

  if(recipients !== null) {
    const eventCertificateRecipients = recipients.filter(registration => clearString(registration.event?.toLowerCase()) === clearString(talksEventName.toLowerCase()));
    if (eventCertificateRecipients.length === 0) throw new Error(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`);
    return eventCertificateRecipients;
  }
  else return null;
}

export async function getNomesFromCertificateRecipients(talksEventName: string): Promise<Set<string>> {
  const recipients = await getCompetTalksEligibleCertificateRecipients(talksEventName);

  if (recipients !== null) {
    const nomes = new Set<string>();
    recipients.forEach(recipient => {
      const formattedName = getFormattedName(recipient.nome);
      nomes.add(formattedName);
    });
    return nomes;
  }
  return new Set<string>();
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

export async function getAverageGradeOfEachQuestion(eventName: string): Promise<ClosedQuestionAnswers> {
  const answersGrade = await getAllAnswersGrade(eventName);

  const averageGrade: ClosedQuestionAnswers = { 
        relevancia: 0, chanceIndicacao: 0, 
        correspondenciaExpectativa: 0, nivelSatisfacao: 0,
        notaOrganizacao: 0 
  };

  if (answersGrade) {
    answersGrade.forEach(recipient => {
      const answers: (keyof ClosedQuestionAnswers)[] = Object.keys(averageGrade) as (keyof ClosedQuestionAnswers)[];

      for (const answer of answers) {
        if(!Object.keys(averageGrade).includes(answer)) continue;
        const value = Number(recipient.closedQuestionAnswers[answer]);

        averageGrade[answer] = (Number(averageGrade[answer]) ?? 0) + value;
      }
    });

    // Calcular a média
    calculateAverageValueOfEachQuestion(averageGrade, answersGrade.length);
  }
  
  return averageGrade;
}


export async function getFrequencyOfAnswersOfEachClosedQuestion(eventName: string): Promise< AnswersFrequency > {
  const answersGrade = await getAllAnswersGrade(eventName);

  const answersFrequency: AnswersFrequency = { 
    relevancia: [0, 0, 0, 0, 0], chanceIndicacao: [0, 0, 0, 0, 0], 
    correspondenciaExpectativa: [0, 0, 0, 0, 0], nivelSatisfacao: [0, 0, 0, 0, 0],
    notaOrganizacao: [0, 0, 0, 0, 0] 
  };

  const keys = Object.keys(answersFrequency) as (keyof typeof answersFrequency)[];

  answersGrade?.forEach(answer => {
    for(const key of keys) {
      answersFrequency[key][answer.closedQuestionAnswers[key] - 1]++;
    }
  });

  return answersFrequency;
}


export async function getAllSugestions(eventName: string): Promise<string[]> {
  const answersGrade = await getAllAnswersGrade(eventName);

  if(answersGrade) {
    const sugestions: string[] = answersGrade.map(answer => answer.openQuestionAnswers?.sugestao)
                                .filter(answer => answer !== undefined);

    return sugestions;
  }

  return [];
}


function clearString(str: string): string {
  if(str === undefined) return str;

  // Remover caracteres especiais no início e no final
  let resultado = str.replace(/^[^\w\s]+|[^\w\s]+$/g, '');

  // Remover espaços extras no meio da string
  resultado = resultado.replace(/\s+/g, ' ');

  return resultado.trim();
}

async function getRegistrationFormsResponses(formID: string) {
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

  return res;
}

async function getCertificateFormsResponses(formID: string) {
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

  return res;
}

function getRegistrationAttributes(form: any) {
  const eventOption1 = form.answers[FormInputRegistration.EVENTO1]?.textAnswers.answers[0].value;
  const eventOption2 = form.answers[FormInputRegistration.EVENTO2]?.textAnswers.answers[0].value;

  const event: string = eventOption1 !== undefined? eventOption1 : eventOption2;
  const nome: string = form.answers[FormInputRegistration.NOME]?.textAnswers.answers[0].value;
  const email: string = form.answers[FormInputRegistration.EMAIL]?.textAnswers.answers[0].value;
  const matricula: string = form.answers[FormInputRegistration.MATRICULA]?.textAnswers.answers[0].value;
  const createTime: string = form.createTime;

  return { event, nome, email, matricula, createTime }
}

function getCertificateRecipientAttributes(form: any) {
  const event: string = form.answers[FormInput.EVENTO]?.textAnswers.answers[0].value;
  const nome: string = form.answers[FormInput.NOME]?.textAnswers.answers[0].value;
  const email: string = form.answers[FormInput.EMAIL]?.textAnswers.answers[0].value;
  const matricula: string = form.answers[FormInput.MATRICULA]?.textAnswers.answers[0].value;
  const createTime: string = form.createTime;

  const closedQuestionAnswers: ClosedQuestionAnswers = { 
    relevancia: Number(form.answers[FormInput.RELEVANCIA_TEMA]?.textAnswers.answers[0].value),
    chanceIndicacao: Number(form.answers[FormInput.CHANCE_INDICAR]?.textAnswers.answers[0].value),
    correspondenciaExpectativa: Number(form.answers[FormInput.CORRESPONDENCIA_EXPECTATIVAS]?.textAnswers.answers[0].value),
    nivelSatisfacao: Number(form.answers[FormInput.NIVEL_SATISFACAO]?.textAnswers.answers[0].value),
    notaOrganizacao: Number(form.answers[FormInput.NOTA_ORGANIZACAO]?.textAnswers.answers[0].value),
  }

  const sugestionOption1 = form.answers[FormInput.SUGESTAO1]?.textAnswers.answers[0].value;
  const sugestionOption2 = form.answers[FormInput.SUGESTAO2]?.textAnswers.answers[0].value;  

  const openQuestionAnswers: OpenQuestionAnswers = {
    sugestao: (sugestionOption1 !== undefined? sugestionOption1 : sugestionOption2)
  }

  const questionAnswers = { closedQuestionAnswers, openQuestionAnswers };

  return { nome, email, event, matricula, createTime, questionAnswers };
}

function calculateAverageValueOfEachQuestion(averageGrade: ClosedQuestionAnswers, length: number): ClosedQuestionAnswers {
  for (const key of Object.keys(averageGrade) as (keyof typeof averageGrade)[]) {
    averageGrade[key] = averageGrade[key]! / length;
  }

  return averageGrade;
}

export function getFormattedName(name: string): string {
  name = name.trim();
  return capitalizeFirstLetter(name);
}

function capitalizeFirstLetter(str: string): string {
  const parts = str.split(' ');
  const formattedParts = parts.map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  return formattedParts.join(' ');
}