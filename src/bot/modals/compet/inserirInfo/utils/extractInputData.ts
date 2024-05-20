import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";
import { Url } from "url";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
};

export interface ExtractInputDataResponse {
    nome: string,
    telefone: string,
    email: string,
    instagram?: string | undefined,
    linkedin?: string | undefined,
};

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "" );
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i)} ));

    interface InputFieldsRequest {
        nome: string,
        telefone: string,
        email: string,
        instagram?: string | undefined,
        linkedin?: string | undefined,
    }

    const { nome, telefone, email, instagram, linkedin }: InputFieldsRequest = Object.assign({}, ...input_data);

    return { nome, telefone, email, instagram, linkedin };
}