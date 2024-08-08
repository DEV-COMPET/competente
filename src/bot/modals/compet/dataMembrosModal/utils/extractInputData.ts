import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    datae: string
    datas: string
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        datae:string
        datas: string
    }

    const { datae,datas }: InputFieldsRequest = Object.assign({}, ...input_data);

    return {  
 
        datae: datae.trim(), 
        datas: datas.trim() 
    }
}