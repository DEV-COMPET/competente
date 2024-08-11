import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { selectedMembers } from "@/bot/selectMenus/certificadoConclusao/certificadoConclusaoMenu";
import { dataEntrada, dataSaida } from "@/bot/modals/compet/certificadoConclusaoModal/certificadoConclusaoModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { gerarPDF } from "@/bot/utils/pdf/completionCertificate/completionCertificate";

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

        await gerarPDF(memberName, local, dataEntradaMembro, dataSaidaMembro, dataSaidaMembro, nomeSaida);
        await editLoadingReply({ interaction, title: "Gerando certificado..." });
        await uploadToFolder(`${nomeSaida}.pdf`, "1LkLlx8raqObL_8CxIfOlLtPRBUM_yE_R");
        return editSucessReply({ interaction, title: `Certificado de ${memberName} gerado com sucesso!` });
    }
});