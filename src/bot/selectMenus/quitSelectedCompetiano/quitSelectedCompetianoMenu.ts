import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "../getTalksInfo/getInfoMenuData.json"
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const selectedMemberName = interaction.values[0];
        console.log("selectedMemberName: ", selectedMemberName);

        const getMemberData = await fetchDataFromAPI({
            json: true, method: "GET", url: selectedMemberName
        })
        if (getMemberData.isLeft())
            return await editErrorReply({
                error: getMemberData.value.error, interaction,
                title: "Não foi possivel listar os competianos"
            })

        const data: CompetianoType = getMemberData.value.responseData;
        if (!data.membro_ativo)
            return await editErrorReply({
                error: new Error("Competiano já está inativo"), interaction,
                title: "O membro já está inativo"
            })

        const quitedMemberResponse = await fetchDataFromAPI({
            json: true, method: "PUT", url: selectedMemberName,
            bodyData: { membro_ativo: false, data_fim: new Date() }
        })
        if (quitedMemberResponse.isLeft())
            return await editErrorReply({
                error: quitedMemberResponse.value.error, interaction,
                title: "Não foi possivel remover o competiano"
            })

        return await editSucessReply({
            interaction, title: `Competiano '${selectedMemberName}' removido com sucesso`,
            url_imagem: data.url_imagem
        })
    }
});
