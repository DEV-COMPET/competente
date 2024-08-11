import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        titulo: string,
        data_new: string
        email_assinante: string,
        nome_assinante: string,
        minutos_totais: number
        link: string
    }

    const { email_assinante, link, minutos_totais, nome_assinante, titulo, data_new }: InputFieldsRequest = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });

    const minutos_input = minutos_totais as number;
    const timing: { horas: unknown; minutos: unknown } = {
        horas: Math.trunc(minutos_input / 60),
        minutos: minutos_input % 60,
    };
    const { horas, minutos } = {
        horas: timing.horas as string,
        minutos: timing.minutos as string,
    };

    const parts = data_new.split("-"); // Split the string into parts
    const day = parseInt(parts[0], 10); // Parse day as an integer
    const month = parseInt(parts[1], 10) - 1; // Parse month as an integer (months are 0-indexed)
    const year = parseInt(parts[2], 10); // Parse year as an integer

    const data = new Date(year, month, day);

    return { horas, link, minutos, titulo, data, email_assinante, nome_assinante }
}

interface ExtractInputDataResponse {
    horas: string,
    minutos: string,
    link?: string,
    email_assinante: string
    nome_assinante: string
    titulo: string
    data: Date
}