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
} = readJsonFile({ dirname: __dirname, partialPath: 'createMemberModalData.json' });

const createMemberModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "addmember",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const { inputData } = extractInputData({ inputFields, interaction })
        const validateInputDataResponse = await validateInputData({ inputData })
        if (validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                error: validateInputDataResponse.value.error, interaction,
                title: "Não foi possível adicionar o competiano no banco de dados."
            })
        }

        const { nome, data_inicio, linkedin, email, url_imagem } = inputData

        return await editSucessReply({
            interaction, title: "Competiano criado com sucesso. Seja bem vindo!!",
            fields: [
                {
                    name: "Nome",
                    value: nome,
                    inline: false
                },
                {
                    name: "Data de início",
                    value: data_inicio.toString(),
                    inline: false
                },
                {
                    name: "Linkedin",
                    value: linkedin || " Nenhum linkedin informado",
                    inline: false,
                },
                {
                    name: "Email",
                    value: email,
                    inline: false
                }
            ],
            url_imagem: url_imagem || "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
        })
    },
});

export { createMemberModal };