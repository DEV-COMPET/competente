import { MateriasType } from "@/api/modules/materias/entities/materias.entity";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { TextInputComponentData } from "discord.js";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    inputData: MateriasType
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {

    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        nome: string
        periodo: string
        natureza: string
        corequisitos: string | undefined
        prerequisitos: string | undefined
    }

    const { corequisitos, natureza, nome, periodo, prerequisitos }: InputFieldsRequest = Object.assign({}, ...input_data);

    console.dir({prerequisitos})

    const corequisitosArray = corequisitos ? corequisitos?.split(';').map((corequisito) => corequisito.trim()) : []
    const prerequisitosArray = prerequisitos ? prerequisitos?.split(';').map((corequisito) => corequisito.trim()) : []
    
    console.dir({ prerequisitos, corequisitos }, { depth: null })

    return {
        inputData: {
            corequisitos: corequisitosArray, natureza, nome, periodo, prerequisitos: prerequisitosArray
        }
    }
}

