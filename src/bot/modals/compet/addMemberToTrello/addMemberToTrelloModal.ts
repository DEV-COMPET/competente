import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'addMemberToTrello.json' });

const addMemberToTrelloModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "addmembertotrello",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";
        console.log("oi2");
        await interaction.deferReply({ ephemeral: true })

        const { email } = extractInputData({ inputFields, interaction });
        console.log("The email is", email);
        const validateInputDataResponse = await validateInputData({ email })
        if (validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                error: validateInputDataResponse.value.error, interaction,
                title: "Não foi possível adicionar o competiano ao Trello"
            })
        } 

        return await editSucessReply({
            interaction, title: "Competiano adicionado ao Trello!",
            fields: [
                {
                    name: "E-mail",
                    value: email,
                    inline: false
                },
            ],
        })
    },
});

export { addMemberToTrelloModal };