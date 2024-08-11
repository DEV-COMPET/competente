import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { advertir } from "./utils/advertir";
import { sendWarningEmailsToCompetianos } from "./utils/sendWarningEmailsToCompetianos";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'advertirModalData.json' });

const advertirModal = makeModal(inputFields, modalBuilderRequest);

/**
 * @author Pedro Augusto de Portilho Ronzani 
 * @description Advertir um membro do Compet.
 */

export default new Modal({
    customId: "advertir",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const inputData = extractInputData({ interaction, inputFields })

        const validateInputDataResponse = await validateInputData(inputData)
        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Nomes Repetidos"
            })

        const advertirResponse = await advertir({ advertidos: validateInputDataResponse.value.inputData.advertidos })
        if (advertirResponse.isLeft())
            return await editErrorReply({
                error: advertirResponse.value.error,
                interaction, title: "Não foi possivel advertir os membros"
            })


        const sendWarningEmailsToCompetianosResponse = await sendWarningEmailsToCompetianos({
            advertidos: advertirResponse.value.advertidos,
            motivos: validateInputDataResponse.value.inputData.motivos
        })
        if (sendWarningEmailsToCompetianosResponse.isLeft())

            // TODO: remover advertência do banco de dados

            return await editErrorReply({
                error: sendWarningEmailsToCompetianosResponse.value.error, interaction, title: "Não foi possível enviar emails para advertidos"
            })

        // COMENTADA PARA NÃO CORRER RISCCO DE ENVIAR EMAILS ERRADOS PARA TUTORES

        /*
                const sendWarningEmailsToTutorsResponse = await sendWarningEmailsToTutors({ advertidos: advertirResponse.value.advertidos })
                if (sendWarningEmailsToTutorsResponse.isLeft())
                    return editErrorReply({
                        error: sendWarningEmailsToTutorsResponse.value.error, interaction, title: "Não foi possível enviar emails para tutores"
                    })
        */

        const advertidos = validateInputDataResponse.value.inputData.advertidos.map(advertido => `- ${advertido.nome} (${advertido.advertencias})\n`).join()

        return await editSucessReply({
            interaction, title: `Membros advertidos com sucesso:\n\n${advertidos}`
        })
    }
});

export { advertirModal };
