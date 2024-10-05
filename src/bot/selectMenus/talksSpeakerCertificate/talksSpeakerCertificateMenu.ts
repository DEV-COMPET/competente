import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectTalksNameMenuData.json"
import { certificadosSpeakersTalksModal } from "@/bot/modals/compet/certificadoPalestranteTalksModal/certificadoPalestranteTalksModal";

const talksName: string[] = [];

/**
 * @author Pedro Vitor Melo Bitencourt
 * @description Retorna estatíscas sobre o talks selecionado
 */
export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        //await interaction.deferReply();

        talksName.length = 0;
        const selectedOption = interaction.values[0];
        talksName.push(selectedOption);

        await interaction.showModal(certificadosSpeakersTalksModal);
    }
});

export { talksName };