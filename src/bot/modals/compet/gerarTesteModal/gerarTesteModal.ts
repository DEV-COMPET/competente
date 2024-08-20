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
} = readJsonFile({ dirname: __dirname, partialPath: 'gerarTesteModalData.json' });

const gerarTesteModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: modalBuilderRequest.customId,

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const { data, minutos_totais, titulo, nome } = extractInputData({ interaction, inputFields })

        const validateInputDataResponse = validateInputData({data, minutos_totais, titulo, nome})
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
                    name: "Nome",
                    value: formated.nome,
                    inline: false
                },
                {
                    name: "Data",
                    value: formated.data,
                    inline: false
                },
                {
                    name: "Minutos",
                    value: formated.minutos_totais,
                    inline: false
                },
                {
                    name: "Titulo",
                    value: formated.titulo,
                    inline: false
                }
            ],
        })
    },
});

export { gerarTesteModal };