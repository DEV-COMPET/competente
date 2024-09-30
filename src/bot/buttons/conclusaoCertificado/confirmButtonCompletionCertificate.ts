import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { selectedMembers } from "@/bot/selectMenus/certificadoConclusao/certificadoConclusaoMenu";
import { dataEntrada, dataSaida } from "@/bot/modals/compet/certificadoConclusaoModal/certificadoConclusaoModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { gerarPDF } from "@/bot/utils/pdf/completionCertificate/completionCertificate";
import { submitCompletionCertificateToAutentique } from "@/bot/utils/autentiqueAPI";
import { env } from "@/env";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { deletePdf } from "@/bot/utils/pdf/deletePDF";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "confirmButtonCompletionCertificateInput.json"
});

export const confirmButtonCompletionCertificate = makeSuccessButton({ customId, label });

export default new Button({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        console.log("Button confirmed completion certificate");

        const member = selectedMembers[selectedMembers.length - 1];
        const memberName = member.split("$$$")[0];
        const dataEntradaMembro = dataEntrada[dataEntrada.length - 1];
        const dataSaidaMembro = dataSaida[dataSaida.length - 1];
        const local = 'Belo Horizonte';
        const nomeSaida = memberName + ' - Certificado Conclusão';

        const pdfFolder = __dirname + "/static/pdfs";
        const pdfPath = pdfFolder + "/" + nomeSaida;

        await editLoadingReply({ interaction, title: "Gerando certificado..." });
        await gerarPDF(memberName, local, dataEntradaMembro, dataSaidaMembro, dataSaidaMembro, nomeSaida, pdfFolder);
        await editLoadingReply({ interaction, title: "Enviando o documento ao Drive..." })
        await uploadToFolder(`${pdfPath}.pdf`, "1LkLlx8raqObL_8CxIfOlLtPRBUM_yE_R");
        await editLoadingReply({ interaction, title: "Enviando o documento ao Autentique..." });

        try {
            await submitCompletionCertificateToAutentique({
                titulo: `COMPET - Certificado de Conclusão de ${memberName}`,
                signer: { 
                    name: env.AUTENTIQUE_COMPLETION_RECIPIENT_NAME, 
                    email: env.AUTENTIQUE_COMPLETION_RECIPIENT_EMAIL,
                },
                filePath: `${pdfPath}.pdf`
            });
            await deletePdf(`${pdfPath}.pdf`);
            return editSucessReply({ interaction, title: `Certificado de ${memberName} gerado com sucesso!` });
      } 
      catch(error) {
        console.error("Erro ao enviar documento para assinatura:", JSON.stringify(error, null, 2));
  
        return await editErrorReply({
          error: new Error(), interaction, title: "Erro ao enviar documento para assinatura"
        })
      }
        
    }
});