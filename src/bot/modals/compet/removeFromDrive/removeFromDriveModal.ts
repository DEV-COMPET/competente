import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { extractInputData } from "./utils/extractInputData";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

import { removeFromDrive } from "@/bot/utils/googleAPI/googleDrive";
import { validateInputData } from "./utils/validateInputData";

const { inputFields, modalBuilderRequest}: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'removeFromDriveData.json'})

const removeFromDriveModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: 'remove-from-drive',

    run: async ({ interaction }) => {
        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true});

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const input_data = extractInputData({ interaction , inputFields });

        await editLoadingReply({
            interaction,
            title: "Fazendo validação dos emails passados"
        });

        const validateInputDataResponse = await validateInputData(input_data);

        if (validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                interaction,
                title: "Não é possível remover dados, emails passados invalido",
                error: validateInputDataResponse.value.error
            })
        }

        await editLoadingReply({
            interaction,
            title: "Verificação concluida, realizando remoção do drive"
        })

        const emailVerificado = validateInputDataResponse.value.inputData.email;

        const removeFromDriveResponse = await removeFromDrive(emailVerificado);
        if (removeFromDriveResponse.isLeft()) {
            return await editErrorReply({
                interaction,
                title: "Alguns emails não foram removidos",
                error: removeFromDriveResponse.value.error
            })
        }

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: `Os seguintes emails foram removidos com sucesso:\n ${(removeFromDriveResponse.value.emailData.join(', '))}`,
                    interaction
                })
            ]
        })
    }
});

export { removeFromDriveModal }