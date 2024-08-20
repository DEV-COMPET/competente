import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    titulo: string
    minutos_totais: string
    data: string
    nome: string
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        titulo: string
        minutos_totais: string
        data: string
        nome: string
    }

    const { titulo, minutos_totais, data, nome }: InputFieldsRequest = Object.assign({}, ...input_data);

    return { 
        titulo: titulo.trim(), 
        minutos_totais: minutos_totais.trim(), 
        data: data.trim(), 
        nome: nome.trim() 
    }
}