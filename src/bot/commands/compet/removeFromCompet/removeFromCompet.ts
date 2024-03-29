import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { checkIfNotAdmin } from "../../../utils/embed/checkIfNotAdmin";
import { readJsonFile } from "../../../utils/json";
import { fetchDataFromAPI } from "../../../utils/fetch/fetchData";
import { editErrorReply } from "../../../utils/discord/editErrorReply";
import { CompetianoType } from "../../../../api/modules/competianos/entities/competiano.entity";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { selectMemberName } from './../../../selectMenus/trello/selectMemberName.json';

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "removeFromCompetInput.json"
});

export default new Command({
    name, description,
    run: async({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if((isNotAdmin).isRight())
            return isNotAdmin.value.response;

        const competentesResponse = await fetchDataFromAPI({
            json: false, url: '/competianos/', method: 'GET'
        });

        if(competentesResponse.isLeft())
            return await editErrorReply({
                interaction, error: competentesResponse.value.error, title: 'Erro ao buscar competentes'}
            );
        
        const responseData: string = competentesResponse.value.responseData;
        const competianos: CompetianoType[] = JSON.parse(responseData);
        const activeCompetianos = await extractData({ competianos });

        const { customId, minMax } = selectMemberName;

        const nameMenu = makeStringSelectMenu({
            customId,
            type: ComponentType.StringSelect,
            options: activeCompetianos.map(member => ({
                label: member.nome,
                value: member.email
            })),
            maxValues: minMax.max,
            minValues: minMax.min
        });

        await interaction.editReply({
            content: 'Selecione o membro a ser removido',
            components: [await makeStringSelectMenuComponent(nameMenu)]
        });
    }
})

interface ExtractDataRequest {
    competianos: CompetianoType[]
}

// interface ExtractDataResponse {
//     email: string,
//     nome: string
// }

async function extractData({ competianos }: ExtractDataRequest) {
    // Filter active competianos
    const activeCompetianos = competianos.filter(competiano => competiano.membro_ativo === true)
                                         .filter(competiano => !competiano.tutor)
                                         .map(competiano => ({ nome: competiano.nome, email: competiano.email }));
    return activeCompetianos;
}
