import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { talksViewersArray, talksName } from "@/bot/selectMenus/certificadosTalks/talksNameCertificateMenu";
import { generatePDFMultiplePages } from "@/bot/selectMenus/certificadosTalks/utils/pdf/multiplePagesPDF";
import { datasArray, minutosArray } from "@/bot/modals/compet/certificadosTalks/certificadosTalksModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { submitTalksCertificateToAutentique } from "@/bot/utils/autentiqueAPI";
import { env } from "@/env";
import { compressPdf } from "@/bot/utils/pdf/comprimirPDF";
import { deletePdf } from "@/bot/utils/pdf/deletePDF";
import { renamePdf } from "@/bot/utils/pdf/renamePDF";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "confirmButtonCertificateInput.json"
});

export const confirmButtonCertificateTalks = makeSuccessButton({ customId, label });

export default new Button({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const eventType = 'COMPET Talks';
        const local = 'Belo Horizonte';
        const nomeSaida = talksName[talksName.length - 1] + ' - ' + datasArray[datasArray.length - 1] + ' - Certificados';

        const pdfFolder = __dirname + "/static/pdfs";
        const pdfPath = pdfFolder + "/" + nomeSaida;
        const compressedPdfPath = pdfFolder + "/" + "output.pdf";

        await editLoadingReply({ interaction, title: "Gerando certificados..." });
        await generatePDFMultiplePages(talksViewersArray, eventType, talksName[talksName.length - 1],
                                        datasArray[datasArray.length - 1], minutosArray[minutosArray.length - 1],
                                        local, nomeSaida, pdfFolder);

        await compressPdf(`${pdfPath}.pdf`, compressedPdfPath);
        await deletePdf(`${pdfPath}.pdf`);
        await renamePdf(compressedPdfPath, `${pdfPath}.pdf`);

        await editLoadingReply({ interaction, title: "Enviando os certificados ao Drive..." })
        await uploadToFolder(`${pdfPath}.pdf`, env.GOOGLE_DRIVE_TALKS_FOLDER_ID);
        await editLoadingReply({ interaction, title: "Enviando os certificados ao Autentique..." });

        const titulo = `COMPET - Certificados de ${talksName[talksName.length - 1]}`;
        const signer = {
            name: env.AUTENTIQUE_TALKS_RECIPIENT_NAME, 
            email: env.AUTENTIQUE_TALKS_RECIPIENT_EMAIL,
        };
        const filePath = `${pdfPath}.pdf`;

        try {
            await submitTalksCertificateToAutentique({ titulo, signer, filePath });
            await deletePdf(`${pdfPath}.pdf`);
            return editSucessReply({ interaction, title: `Certificados do ${talksName[talksName.length - 1]} gerados com sucesso!` });
        }
        catch(e) {
            console.error(`Erro ao enviar o documento ao Autentique: ${e}`);
            return e;
        }

    }
});