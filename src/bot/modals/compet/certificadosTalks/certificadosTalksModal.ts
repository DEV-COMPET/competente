import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { talksViewersArray, talksName } from "@/bot/selectMenus/certificadosTalks/talksNameCertificateMenu";
import { generatePDFMultiplePages } from "@/bot/selectMenus/certificadosTalks/utils/pdf/multiplePagesPDF";
//import { validateInputData } from "./utils/validateInputData";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'certificadosTalksModalData.json' });

const certificadosTalksModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "talks-certificates",

    run: async ({ interaction }) => {
        console.log("98739279798327987983279879732979798")

        if (interaction.channel === null)
            throw "Channel is not cached";

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const inputData = extractInputData({ interaction, inputFields })
        console.log('inputData is: ', inputData);
        
        const validateInputDataResponse = await validateInputData(inputData)
        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Data inválida ou minutos inválidos"
            })
        
        const { data, minutos } = validateInputDataResponse.value.inputData;
        const talksNameString = talksName[talksName.length - 1];
        const eventType = 'COMPET Talks';
        const local = 'Belo Horizonte';
        generatePDFMultiplePages(talksViewersArray, eventType, talksNameString, data, minutos, local).catch(console.error);
    }
});

export { certificadosTalksModal };