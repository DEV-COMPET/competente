import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { talksViewersArray, talksName } from "@/bot/selectMenus/certificadosTalks/talksNameCertificateMenu";
import { generatePDFMultiplePages } from "@/bot/selectMenus/certificadosTalks/utils/pdf/multiplePagesPDF";
import { datasArray, minutosArray } from "@/bot/modals/compet/certificadosTalks/certificadosTalksModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "confirmButtonCertificateInput.json"
});

export const confirmButtonCertificateTalks = makeSuccessButton({ customId, label });

export default new Button({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply();

        const eventType = 'COMPET Talks';
        const local = 'Belo Horizonte';
        const nomeSaida = talksName[talksName.length - 1] + ' - ' + datasArray[datasArray.length - 1] + ' - Certificados';

        await editLoadingReply({ interaction, title: "Gerando certificados..." });
        await generatePDFMultiplePages(talksViewersArray, eventType, talksName[talksName.length - 1],
                                        datasArray[datasArray.length - 1], minutosArray[minutosArray.length - 1],
                                        local, nomeSaida);
        await uploadToFolder(`${nomeSaida}.pdf`, "1LkLlx8raqObL_8CxIfOlLtPRBUM_yE_R");

        return editSucessReply({ interaction, title: "Certificados gerados com sucesso!" });
    }
});