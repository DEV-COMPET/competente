import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    emailsInvite: string
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const  customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i)}));

    interface InputFieldsRequest {
        emailsInvite: string
    }; 
    
    const { emailsInvite }: InputFieldsRequest = Object.assign({}, ...input_data);

    return { emailsInvite };
}