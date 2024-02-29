import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { extractInputData } from "./utils/extractInputData";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

import { sendInviteViaEmail } from "./utils/sendInvite";
import { validateInputData } from "./utils/validateInputData";

const {inputFields, modalBuilderRequest}: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'sendInviteData.json'});

const sendInviteModal = makeModal(inputFields, modalBuilderRequest)

export default new Modal ({
    customId: 'send-invite',

    run : async ({ interaction }) => {
        if (interaction.channel === null) 
            throw "Channel is not cached";


        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response;

        const input_data = extractInputData({ inputFields, interaction });

        await editLoadingReply({
            interaction,
            title: "Fazendo validação dos emails passados"
        });
        
        const validateInputDataResponse = await validateInputData(input_data);
        
        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Não foram informados emails corretamente"
            })

        await editLoadingReply({
            interaction,
            title: "Emails validados! Gerando link..."
        })

        const emailVerificado = validateInputDataResponse.value.inputData.emailsInvite;

        const channel = interaction.channel?.id

        const invite = await interaction.guild?.invites.create(`${channel}`, {
            unique: true,
            maxAge: 86_400
        })

        if (!invite) 
            throw "Não foi possível gerar um convite"

        await editLoadingReply({
            interaction,
            title: "Link gerando, gerando e enviando o email"
        });

        const sendInviteResponse = await sendInviteViaEmail({emailVerificado, invite});
        if(sendInviteResponse.isLeft()) {
            return await editErrorReply({
                interaction,
                title: "Não foi possível enviar o email",
                error: sendInviteResponse.value.error
            })
        }

        return await interaction.editReply({
            embeds:[
                makeSuccessEmbed({
                    title: `O convite foi enviado para os seguintes emails: ${sendInviteResponse.value.emailVerificado.join(", ")}`,
                    interaction
                })
            ]
        })

    }
})

export { sendInviteModal }