'use strict';

import { FormResponseTalks } from "../../typings/forms";

const path = require('path');
const google = require('@googleapis/forms');
const { authenticate } = require('@google-cloud/local-auth');

const competTalksFormId = '1aSdriuBvKrm6dVkl6TRVCY3yz_VriWCcqa7bk_xHy_w';

async function getAllRegistrations(formID: string): Promise<FormResponseTalks[]> {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: 'https://www.googleapis.com/auth/forms.responses.readonly',
  });
  const forms = google.forms({
    version: 'v1',
    auth: auth,
  });
  const res = await forms.forms.responses.list({
    formId: formID,
  });
  const data: Array<any> = res.data.responses
  if (!data) throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const event: string = form.answers["459eff55"]?.textAnswers.answers[0].value
    const nome: string = form.answers["5449dcbb"]?.textAnswers.answers[0].value
    const email: string = form.answers["69f30e2c"]?.textAnswers.answers[0].value
    const matricula: string = form.answers["3ee1b434"]?.textAnswers.answers[0].value
    const certificado = { nome, email, event, matricula }
    console.log(certificado);
    return certificado
  })
  return certificados;

}
export async function getCompetTalksRegistration(talksEventName: string, formID: string): Promise<FormResponseTalks[]> {
  const registrations = await getAllRegistrations(formID);
  const eventRegistrations = registrations.filter(registration => registration.event === talksEventName)
  if (eventRegistrations.length === 0) throw new Error(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`)
  return eventRegistrations

}
