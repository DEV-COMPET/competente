import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./competEmNumerosInput.json"
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { extractData } from "./utils/extractData";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

export default new Command({
    name, description,
    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response

        const competentesResponse = await fetchDataFromAPI({
            json: true, url: "/competianos/", method: "GET"
        })
        if (competentesResponse.isLeft())
            return await editErrorReply({
                interaction, error: competentesResponse.value.error, title: "Erro ao buscar competentes"
            })

        const competianos: CompetianoType[] = competentesResponse.value.responseData

        const extractDataResponse = await extractData({ competianos })

        return editSucessReply({
            interaction, title: "Competentes em números",
            fields: [
                { name: "Membros atuais", value: extractDataResponse.quantidadeMembrosAtuais },
                { name: "Ex-membros", value: extractDataResponse.quantidadeExMembros },
                { name: "Tutores atuais", value: extractDataResponse.quantidadeTutoresAtuais },
                { name: "Ex-tutores", value: extractDataResponse.quantidadeExTutores },
                { name: "Membros com intercâmbio", value: extractDataResponse.quantidadeMembrosComIntercambio },
                { name: "Ex-membros com intercâmbio", value: extractDataResponse.quantidadeExMembrosComIntercambio },
                { name: "Scrum masters", value: extractDataResponse.quantidadeScrumMasters },
                { name: "Tempo médio de permanência", value: extractDataResponse.tempoMedioPermanencia },
                { name: "Maior tempo de permanência", value: extractDataResponse.maiorTempo },
                { name: "Menor tempo de permanência", value: extractDataResponse.menorTempo },
                { name: "Graduandos por período", value: extractDataResponse.frequenciaPeriodos },
                { name: "Graduandos por curso", value: extractDataResponse.frequenciaCursos },
            ]
        })
    },
});
