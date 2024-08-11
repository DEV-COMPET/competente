import { ExtendedModalInteraction } from "@/bot/typings/Modals";

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: string[]
}


export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest) {
    const input_data: { [key: string]: string } = {};
  
    for (const field of inputFields) {
      input_data[field] = interaction.fields.getTextInputValue(field);
    }
  
    return input_data;
  }
  