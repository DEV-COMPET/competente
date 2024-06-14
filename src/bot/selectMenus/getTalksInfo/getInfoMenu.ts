import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./getInfoMenuData.json"
import { parseDataFromSheet, possibleCertificatesInputs, possibleInputs } from "@/bot/utils/googleAPI/getSheetsData";
import { makeModal2 } from "@/bot/utils/modal/makeModal";
import { ComponentType } from "discord.js";
import { inputsArr } from "@/bot/modals/compet/getTalksInfo/variables/inputs";
import { completeData } from "./variables/completeData";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        const inputs: (possibleInputs | possibleCertificatesInputs)[] = interaction.values as (possibleInputs | possibleCertificatesInputs)[]

        inputsArr.push(inputs);

        const data = await parseDataFromSheet({ inputs, sheet: 'certificado' })

        completeData.push(data);

        const getTalksInfoModal = makeModal2({
            inputFields: inputs.map(input => {
                return {
                    customId: input as string,
                    label: `Filtro sobre ${input}`,
                    style: 1,
                    type: ComponentType.TextInput,
                    required: false
                }
            }), modalBuilderRequestData: {
                title: "Obtenha informações de talks",
                customId: "get-talks-info",
                components: []
            }
        })

        await interaction.showModal(getTalksInfoModal);
    }
});
