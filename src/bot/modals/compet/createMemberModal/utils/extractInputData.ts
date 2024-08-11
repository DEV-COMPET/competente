import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    inputData: CompetianoType
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {

    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
    const inputData: CompetianoType = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });

    return { inputData }
}