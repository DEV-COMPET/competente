import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { validateInputData } from "./utils/validateInputData"
import { selectedMembers } from "@/bot/selectMenus/certificadoConclusao/certificadoConclusaoMenu";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'certificadoConclusaoModalData.json' });

const dataMembrosModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: modalBuilderRequest.customId,

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })
        console.log("Modal dataMembros executed");

        const { datae,datas } = extractInputData({ interaction, inputFields })

        const validateInputDataResponse = validateInputData({datae,datas})
        if(validateInputDataResponse.isLeft()) 
            return await editErrorReply({
                error: validateInputDataResponse.value.error,
                interaction, title: "Erro na passagem dos inputs"
            })

        const formated = validateInputDataResponse.value
        const selectedMemberName = selectedMembers[selectedMembers.length-1].split("$$$")[0];

        return await editSucessReply({
            interaction, title: "GG",
            fields: [
                {
                    name: "Membro selecionado",
                    value: selectedMemberName,
                },
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