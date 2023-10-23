import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    advertidos: string[]
    motivos: string[]
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        pessoas: string
        motivos: string
    }

    const { pessoas, motivos }: InputFieldsRequest = Object.assign({}, ...input_data);

    const pessoas_arr = pessoas.split(',').map(pessoa => pessoa.trim())
    const motivos_arr = motivos.split(';').map(motivo => motivo.trim())

    return { advertidos: pessoas_arr, motivos: motivos_arr }
}