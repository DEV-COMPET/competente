import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "../../errors/discordError";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import path from 'path';
import { google } from 'googleapis';

import { env } from "@/env";
const environment = env.ENVIRONMENT;
import { FormInputRegistration } from "../../typings/talks";

const competTalksFormId = env.GOOGLE_FORM_ID;

interface CreateRoleRequest {
    interaction: ExtendedInteraction
}

type CreateRoleResponse = Either<
    { error: DiscordError },
    { events: EventNameStr[] }
>

export async function getAllEventNames({ interaction }: CreateRoleRequest): Promise<CreateRoleResponse> {

    const guild = interaction.guild;

    if (!guild)
        return left({
            error: new DiscordError("Esse comando so pode ser usado em um server (Erro de Guild)")
        });

    const events = await getEventNames();

    const allEvents: EventNameStr[] = Array.from(events);

    return right({ events: allEvents })
}

type EventNameStr = {
    name: string;
};

async function getEventNames(): Promise<Set<any>> {
    const formID: string = competTalksFormId;
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
    const data: Array<any> | undefined = res.data.responses;
    
    
  
    if(data !== undefined) {
      // const eventNames = data.filter(resp => resp.answers[FormInputRegistration.EVENTO]?.textAnswers.answers[0].value !== undefined);
      const eventNames = new Set();
      data.forEach(dado => {
        const event = dado.answers[FormInputRegistration.EVENTO]?.textAnswers.answers[0].value;
        if(event !== undefined)
        eventNames.add(event);
      });
    //   console.log(eventNames)
  
  
      return eventNames;
    }
    else return new Set();
  }
  