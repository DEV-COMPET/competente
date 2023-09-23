import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { createTalksInDatabase } from "./utils/createTalksInDatabase";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'createTalksModalData.json' });

const createTalksModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "createtalks",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const inputData = extractInputData({ interaction, inputFields })
        const validateInputDataResponse = validateInputData(inputData)
        if (validateInputDataResponse.isLeft()) {
            console.error(validateInputDataResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel criar o talks devido a dados inválidos.",
                        error: { code: 401, message: validateInputDataResponse.value.error.message },
                        interaction,
                    })
                ]
            })
        }

        const createTalksInDatabaseResponse = await createTalksInDatabase(inputData)
        if (createTalksInDatabaseResponse.isLeft()) {
            console.error(createTalksInDatabaseResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel enviar o talks para o Banco de Dados",
                        error: {
                            code: 401,
                            message: createTalksInDatabaseResponse.value.error.message
                        },
                        interaction,
                    })
                ]
            })
        }

        // TODO: agendar video no youtube

        // TODO: mandar email 

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Ate o momento cria",
                    interaction,
                })
            ]
        })
    }
});

export { createTalksModal };
