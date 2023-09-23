import { FormResponseTalks, FormInput } from "../../typings/talks";
import path from 'path';
import { google } from 'googleapis';
import { env } from "@/env";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { Either, left, right } from "@/api/@types/either";

const competTalksFormId = env.GOOGLE_FORM_ID;
const environment = env.ENVIRONMENT;

type GetAllRegistrationsResponse = Either<
  { error: ResourceNotFoundError },
  { certificados: FormResponseTalks[] }
>

export async function getAllRegistrations(formID: string): Promise<GetAllRegistrationsResponse> {
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

  if (!data)
    return left({ error: new ResourceNotFoundError("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!") })
 // throw new Error("Não foi possivel encontrar nenhuma resposta para o formulário requisitado!")
  const certificados = data.map(form => {
    const event: string = form.answers[FormInput.EVENTO]?.textAnswers.answers[0].value
    const nome: string = form.answers[FormInput.NOME]?.textAnswers.answers[0].value
    const email: string = form.answers[FormInput.EMAIL]?.textAnswers.answers[0].value
    const matricula: string = form.answers[FormInput.MATRICULA]?.textAnswers.answers[0].value
    const createTime: string = form.createTime
    const certificado = { nome, email, event, matricula, createTime }
    return certificado
  })
  return right({ certificados });

}

type GetCompetTalksRegistrationResponse = Either<
  { error: ResourceNotFoundError },
  { eventRegistrations: FormResponseTalks[] }
>

export async function getCompetTalksRegistration(talksEventName: string): Promise<GetCompetTalksRegistrationResponse> {
  
  const registrations = await getAllRegistrations(competTalksFormId);
  if(registrations.isLeft()) 
    return left({error: registrations.value.error})

  // O código abaixo remove os caracteres especiais
  const eventRegistrations = registrations.value.certificados.filter(registration => registration.event?.toLowerCase() === talksEventName.toLowerCase())
  if (eventRegistrations.length === 0) 
    return left({ error: new ResourceNotFoundError(`O evento ${talksEventName} não existe ou não possui nenhum aluno apto a receber o certificado`) })

  return right({ eventRegistrations })
}
