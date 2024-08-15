import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { validateInputData } from "./utils/validateInputData"
import { selectedMembers } from "@/bot/selectMenus/certificadoConclusao/certificadoConclusaoMenu";
import { makeButtonsRow, makeRedirectLinkButton } from "@/bot/utils/button/makeButton";
import { confirmButtonCompletionCertificate } from "@/bot/buttons/conclusaoCertificado/confirmButtonCompletionCertificate";
import { cancelButtonCompletionCertificate } from "@/bot/buttons/conclusaoCertificado/cancelButtonCompletionCertificate";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'certificadoConclusaoModalData.json' });

const dataMembrosModal = makeModal(inputFields, modalBuilderRequest);

const dataEntrada: string[] = [];
const dataSaida: string[] = [];

export default new Modal({
    customId: modalBuilderRequest.customId,

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })
        console.log("Modal dataMembros executed");

        const { datae,datas } = extractInputData({ interaction, inputFields })

        const validateInputDataResponse = validateInputData({datae,datas})
        if(validateInputDataResponse.isLeft()) 
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Erro na passagem dos inputs"
            })

        const formated = validateInputDataResponse.value;
        const dataEntradaContent = `Data de entrada: ${formated.datae}`;
        const dataSaidaContent = `Data de saída: ${formated.datas}`;

        const selectedMemberName = selectedMembers[selectedMembers.length-1].split("$$$")[0];
        const memberNameContent = `Membro selecionado: ${selectedMemberName}`;

        dataEntrada.push(formated.datae);
        dataSaida.push(formated.datas);

        const linkButton = makeRedirectLinkButton({ customId: "redirect", label: "Clique aqui para acessar o certificado", url: "https://drive.google.com/drive/folders/1LkLlx8raqObL_8CxIfOlLtPRBUM_yE_R"});
        const buttonRow = await makeButtonsRow([confirmButtonCompletionCertificate, cancelButtonCompletionCertificate, linkButton]);

        await interaction.editReply({
            content: `Confirme se as seguintes informações estão corretas:\n${memberNameContent}\n${dataEntradaContent}\n${dataSaidaContent}`,
            components: [buttonRow],
        });
    },
});

export { dataMembrosModal, dataEntrada, dataSaida };