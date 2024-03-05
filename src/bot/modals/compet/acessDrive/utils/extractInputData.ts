import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
};

export interface ExtractInputDataResponse {
    emailAcess_arr: string[]
};

export function extractInputData( { inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const inputData = customIds.map(i=> ({ [i]: interaction.fields.getTextInputValue(i)}));
    
    interface InputFieldsRequest {
        emailsAcess: string
    };

    
    const { emailsAcess }: InputFieldsRequest = Object.assign({}, ... inputData);
    
    const emailAcess_arr = emailsAcess.split(';').map(email => email.trim());
    
    return { emailAcess_arr };
}