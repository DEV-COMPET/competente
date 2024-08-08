import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { validateInputData } from "./utils/validateInputData"

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'dataMembrosModalData.json' });

const dataMembrosModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: modalBuilderRequest.customId,

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const { datae,datas } = extractInputData({ interaction, inputFields })

        const validateInputDataResponse = validateInputData({datae,datas})
        if(validateInputDataResponse.isLeft()) 
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Erro na passagem dos inputs"
            })

        const formated = validateInputDataResponse.value

        return await editSucessReply({
            interaction, title: "GG",
            fields: [
                {
                    name: "Data Entrada",
                    value: formated.datae,
                    inline: false
                },
                {
                    name: "Data Saida",
                    value: formated.datas,
                    inline: false
                }
            ],
        })
    },
});

export { dataMembrosModal };