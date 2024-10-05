import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { talksName } from "@/bot/selectMenus/talksSpeakerCertificate/talksSpeakerCertificateMenu";
import { makeButtonsRow, makeRedirectLinkButton } from "@/bot/utils/button/makeButton";
import { confirmButtonTalksSpeakersCertificate } from "@/bot/buttons/certificadosPalestrantesTalks/confirmButtonTalksSpeakerCertificate";
import { cancelButtonTalksSpeakersCertificate } from "@/bot/buttons/certificadosPalestrantesTalks/cancelButtonTalksSpeakerCertificate";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'certificadoPalestranteTalksModalData.json' });

const certificadosSpeakersTalksModal = makeModal(inputFields, modalBuilderRequest);
const datasArray: string[] = [];
const minutosArray: string[] = [];
const palestrantesArray: string[][] = [];

export default new Modal({
    customId: "talks-speakers-certificates",

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.channel === null)
            throw "Channel is not cached";

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const inputData = extractInputData({ interaction, inputFields })
        
        const validateInputDataResponse = await validateInputData(inputData)
        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Nomes dos palestrantes inválidos ou data inválida ou minutos inválidos"
            })
        
        const { palestrantes, data, minutos } = validateInputDataResponse.value.inputData;
        datasArray.push(data); minutosArray.push(minutos); palestrantesArray.push(palestrantes);

        const talksNameContent = `Nome da palestra: ${talksName[talksName.length-1]}`;
        const dataContent = `Data: ${data}`;
        const minutosContent = `Minutos: ${minutos}`;
        const speakersText = `Palestrantes: ${palestrantes.join(', ')}`;

        const linkButton = makeRedirectLinkButton({ customId: "redirect", label: "Clique aqui para acessar o certificado", url: "https://drive.google.com/drive/folders/1LkLlx8raqObL_8CxIfOlLtPRBUM_yE_R"});
        const buttonRow = await makeButtonsRow([confirmButtonTalksSpeakersCertificate, cancelButtonTalksSpeakersCertificate, linkButton]);

        await interaction.editReply({
            content: `Confirme se as seguintes informações estão corretas:\n${talksNameContent}\n${dataContent}\n${minutosContent}\n${speakersText}`,
            components: [buttonRow],
        });
    }
});

export { palestrantesArray, certificadosSpeakersTalksModal, datasArray, minutosArray };