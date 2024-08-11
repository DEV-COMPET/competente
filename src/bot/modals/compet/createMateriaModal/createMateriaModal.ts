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
} = readJsonFile({ dirname: __dirname, partialPath: 'createMateriaModalData.json' });

const createMateriaModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "addmateria",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const { inputData } = extractInputData({ inputFields, interaction })

        console.log(inputData.prerequisitos)

        const validateInputDataResponse = await validateInputData({ inputData })
        if (validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                error: validateInputDataResponse.value.error, interaction,
                title: "Não foi possível adicionar a materia no banco de dados."
            })
        }

        const { corequisitos, natureza, nome, periodo, prerequisitos } = inputData

        console.dir(inputData, { depth: null })

        return await editSucessReply({
            interaction, title: "Materia Adicionada",
            fields: [
                {
                    name: "Nome",
                    value: nome,
                    inline: false
                },
                {
                    name: "Periodo",
                    value: periodo,
                    inline: false
                },
                {
                    name: "Natureza",
                    value: natureza,
                    inline: false,
                },
                {
                    name: "Corequisitos",
                    value: corequisitos.join(', ') || " Nenhum corequisito informado",
                    inline: false
                },
                {
                    name: "Prerequisitos",
                    value: prerequisitos.join(', ') || " Nenhum prerequisito informado",
                    inline: false
                }
            ]
        })
    },
});

export { createMateriaModal };