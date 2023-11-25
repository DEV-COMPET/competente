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
    { events: Event[] }
>

type Event = {
  name: string;
  date: Date;
};

class NameDateSet extends Set<{ name: string; date: Date }> {
  add(value: { name: string; date: Date }): this {
    if (this.isValidObject(value)) {
      const existingObject = Array.from(this.values()).find(obj => obj.name === value.name);

      if (existingObject) {
        // Se o novo objeto tem uma data mais antiga, atualizamos a data
        if (value.date < existingObject.date) {
          existingObject.date = value.date;
        }
      } else {
        super.add(value);
      }
    } else {
      console.error("Objeto inválido: ele deve ter os atributos 'name' e 'date'");
    }
    return this;
  }

  private isValidObject(value: any): value is { name: string; date: Date } {
    return (
      typeof value === "object" &&
      value !== null &&
      "name" in value &&
      typeof value.name === "string" &&
      "date" in value &&
      value.date instanceof Date
    );
  }
}

export async function getAllEventNames({ interaction }: CreateRoleRequest): Promise<CreateRoleResponse> {

    const guild = interaction.guild;

    if (!guild)
        return left({
            error: new DiscordError("Esse comando so pode ser usado em um server (Erro de Guild)")
        });

    const events = await getEventNames();

    const allEvents: Event[] = Array.from(events);
    console.log(allEvents)

    return right({ events: allEvents })
}

async function getEventNames(): Promise<NameDateSet> {
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
      const eventNames = new NameDateSet();
      data.forEach(dado => {
        const event = dado.answers[FormInputRegistration.EVENTO]?.textAnswers.answers[0].value;
        const date = dado.createTime;
        if(event !== undefined)
          eventNames.add({ name: event, date: new Date(date) });
      });
  
      return eventNames;
    }
    else return new NameDateSet();
  }
  