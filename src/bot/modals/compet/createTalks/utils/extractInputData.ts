import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    palestrantes: string[]
    titulo: string
    data: string
    hora: string
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        palestrantes: string
        titulo: string
        data: string
        hora: string
    }

    const { palestrantes, titulo, data, hora }: InputFieldsRequest = Object.assign({}, ...input_data);

    const palestrantes_separados = palestrantes.split(',').map(nome => { return nome.trim() })

    return { palestrantes: palestrantes_separados, data, titulo, hora }
}