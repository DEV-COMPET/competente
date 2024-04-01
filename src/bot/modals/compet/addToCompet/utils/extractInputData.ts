import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
};

export interface ExtractInputDataResponse {
    nome: string,
    telefone: string,
    email: string,
    lattes: string,
    imageBB: string
};

export function extractInputData ({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((fields) => fields.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
    
    interface InputFieldsRequest {
        nome: string,
        telefone: string,
        email: string,
        lattes: string,
        imageBB: string 
    }

    const { nome, telefone, email, lattes, imageBB }: InputFieldsRequest = Object.assign({}, ...input_data);

    return { nome, telefone, email, lattes, imageBB};
}