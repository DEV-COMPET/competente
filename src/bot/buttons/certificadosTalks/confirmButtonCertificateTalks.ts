import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { talksViewersArray, talksName } from "@/bot/selectMenus/certificadosTalks/talksNameCertificateMenu";
import { generatePDFMultiplePages } from "@/bot/selectMenus/certificadosTalks/utils/pdf/multiplePagesPDF";
import { datasArray, minutosArray } from "@/bot/modals/compet/certificadosTalks/certificadosTalksModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "confirmButtonCertificateInput.json"
});

export const confirmButtonCertificateTalks = makeSuccessButton({ customId, label });

export default new Button({
    customId,
    run: async ({ interaction }) => {
        console.log("Button confirmed")
        await interaction.deferReply();

        const eventType = 'COMPET Talks';
        const local = 'Belo Horizonte';
        await generatePDFMultiplePages(talksViewersArray, eventType, talksName[talksName.length - 1],
                                        datasArray[datasArray.length - 1], minutosArray[minutosArray.length - 1], local);

        return editSucessReply({ interaction, title: "Certificados gerados com sucesso!" });
    }
});