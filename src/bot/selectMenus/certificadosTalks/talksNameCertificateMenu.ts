import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./talksNameCertificateMenuData.json"
import {
    getNomesFromCertificateRecipients,
} from "@/bot/utils/googleAPI/getCompetTalks1";
import { certificadosTalksModal } from "@/bot/modals/compet/certificadosTalks/certificadosTalksModal";

const talksViewersArray: string[] = [];
const talksName: string[] = [];

/**
 * @author Pedro Vitor Melo Bitencourt
 * @description Gera certificados para os participantes de um talks
 */
export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        //await interaction.deferReply();

        const selectedOption = interaction.values[0];
        talksName.push(selectedOption);
        const talksViewersSet = await getNomesFromCertificateRecipients(selectedOption);
        
        for(const viewer of talksViewersSet)
            talksViewersArray.push(viewer);
    
        await interaction.showModal(certificadosTalksModal);
    }
});

export { talksName, talksViewersArray };