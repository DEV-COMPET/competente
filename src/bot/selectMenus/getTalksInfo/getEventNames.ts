import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectEventNameMenuData.json"
import { registerSpeakersCertificatesModal } from "@/bot/modals/compet/registerSpeakersCertificate/registerSpeakersCertificate";

/**
 * @author Pedro Vitor Melo Bitencourt
 * @description Retorna estatíscas sobre o talks selecionado
 */

let selectedOption: string;

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {
        selectedOption = interaction.values[0];
        console.log(selectedOption)
        

        await interaction.showModal(registerSpeakersCertificatesModal)
    }
});

export { selectedOption };