import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";
import { env } from "process";

interface ExtractInputDataResponse {
    createMemberUrl: string
    requestOptions: {
        method: string;
        body: string;
        headers: {
            "Content-Type": string;
        };
    }
}

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction
    inputFields: TextInputComponentData[]
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {

    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
    const combinedData: CompetianoType = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });
    const requestOptions = {
        method: "post",
        body: JSON.stringify(combinedData),
        headers: { "Content-Type": "application/json" },
    };

    const createMemberUrl = env.ENVIRONMENT === "development" ? "http://localhost:4444/competianos" : `${env.HOST}/competianos` || "http://localhost:4444/competianos/";

    return { createMemberUrl, requestOptions }
}
