import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { partial_to_full_path, readJsonFile } from "@/bot/utils/json";
import { selectedMembers } from "@/bot/selectMenus/certificadoConclusao/certificadoConclusaoMenu";
import { dataEntrada, dataSaida } from "@/bot/modals/compet/certificadoConclusaoModal/certificadoConclusaoModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { gerarPDF } from "@/bot/utils/pdf/completionCertificate/completionCertificate";
import { submitToAutentique } from "@/bot/utils/autentiqueAPI";
import { env } from "@/env";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "confirmButtonCompletionCertificateInput.json"
});

export const confirmButtonCompletionCertificate = makeSuccessButton({ customId, label });

export default new Button({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply();

        console.log("Button confirmed completion certificate");

        const member = selectedMembers[selectedMembers.length - 1];
        const memberName = member.split("$$$")[0];
        const dataEntradaMembro = dataEntrada[dataEntrada.length - 1];
        const dataSaidaMembro = dataSaida[dataSaida.length - 1];
        const local = 'Belo Horizonte';
        const nomeSaida = memberName + ' - Certificado Conclusão';

        const pdfFolder = __dirname + "/static/pdfs";
        const pdfPath = pdfFolder + "/" + nomeSaida;

        await gerarPDF(memberName, local, dataEntradaMembro, dataSaidaMembro, dataSaidaMembro, nomeSaida, pdfFolder);
        await editLoadingReply({ interaction, title: "Gerando certificado..." });
        await uploadToFolder(`${pdfPath}.pdf`, "1LkLlx8raqObL_8CxIfOlLtPRBUM_yE_R");
        await editLoadingReply({ interaction, title: "Enviando o documento ao Autentique..." });
        
        console.log(`${pdfPath}.pdf`)

        try {
            await submitToAutentique({
                numPages: 1,
                titulo: `COMPET - Certificado de Conclusão de ${memberName}`,
                signer: { 
                    name: env.AUTENTIQUE_RECIPIENT_NAME, 
                    email: env.AUTENTIQUE_RECIPIENT_EMAIL,
                },
                filePath: `${pdfPath}.pdf`
            });

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