import { FormResponseTalks, FormInput } from "../../typings/talks";
import path from 'path';
import { google } from 'googleapis';
import dotenv from "dotenv";
dotenv.config();
const competTalksFormId = '1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w';
const environment = process.env.ENVIRONMENT;
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
  const data: Array<any> | undefined = res.data.responses

  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const event: string = form.answers[FormInput.EVENTO]?.textAnswers.answers[0].value
    const nome: string = form.answers[FormInput.NOME]?.textAnswers.answers[0].value
    const email: string = form.answers[FormInput.EMAIL]?.textAnswers.answers[0].value
    const matricula: string = form.answers[FormInput.MATRICULA]?.textAnswers.answers[0].value
    const createTime: string = form.createTime
    const certificado = { nome, email, event, matricula, createTime }
    return certificado
  })
  return certificados;

}
export async function getCompetTalksRegistration(talksEventName: string): Promise<FormResponseTalks[]> {
  const registrations = await getAllRegistrations(competTalksFormId);
  // O código abaixo remove os caracteres especiais
  const eventRegistrations = registrations.filter(registration => registration.event?.toLowerCase() === talksEventName.toLowerCase())
  if (eventRegistrations.length === 0) throw new Error(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`)
  return eventRegistrations
}
