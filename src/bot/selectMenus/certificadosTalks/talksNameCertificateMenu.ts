import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./talksNameCertificateMenuData.json"
import {
    getNomesFromCertificateRecipients,
} from "@/bot/utils/googleAPI/getCompetTalks1";
import { minutesToString } from "./utils/utils";
import { generatePDFMultiplePages } from "./utils/pdf/multiplePagesPDF";
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
        console.log('selectedOption is: ', selectedOption);
        talksName.push(selectedOption);
        const talksViewersSet = await getNomesFromCertificateRecipients(selectedOption);
        
        for(const viewer of talksViewersSet)
            talksViewersArray.push(viewer);
    
        console.log('talksViewersArray is: ', talksViewersArray);

        // const eventType = 'COMPET Talks';
        // const eventName = 'Simulação Gerador de Certificados, Teste';
        // const date = '20 de fevereiro de 2022';
        // const minutes = minutesToString(115);
        // const local = 'Belo Horizonte';
        //generatePDFMultiplePages(talksViewersArray, eventType, eventName, date, minutes, local).catch(console.error);
        await interaction.showModal(certificadosTalksModal);
    }
});

export { talksName, talksViewersArray };