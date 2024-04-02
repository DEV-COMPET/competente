import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";

import { acessDrive } from "@/bot/utils/googleAPI/googleDrive";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'acessDriveData.json' });


const acessDriveModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal ({
    customId: 'acess-drive',

    run: async ({ interaction }) => {
        if (interaction.channel ===  null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if(isNotAdmin.isRight())
            return isNotAdmin.value.response;

        const inputData = extractInputData( { inputFields, interaction});

        await editLoadingReply({
            interaction,
            title: "Realizando validação de dados"
        });

        const validateInputDataResponse = await validateInputData(inputData);

        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Há dados informados de forma incorreta"
            });

        await editLoadingReply({
            interaction,
            title: "Emails validaddos! Permitindo acessos..."
        });

        const emailVerified = validateInputDataResponse.value.inputData.email;

        const acessDriveResponse = await acessDrive(emailVerified);
        
        if (acessDriveResponse.isLeft()) 
            return await editErrorReply({
                interaction, title: "Alguns emails não foram adicionados",
                error: acessDriveResponse.value.error
            })
    

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: `O acesso dos seguintes emails tiveram sucesso:\n ${(acessDriveResponse.value.emailData.join(', '))}`,
                    interaction
                })
            ]
        });
    }

})

export { acessDriveModal }