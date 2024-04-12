import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { checkIfNotAdmin } from "../../../utils/embed/checkIfNotAdmin";
import { readJsonFile } from "../../../utils/json";
import { fetchDataFromAPI } from "../../../utils/fetch/fetchData";
import { editErrorReply } from "../../../utils/discord/editErrorReply";
import { CompetianoType } from "../../../../api/modules/competianos/entities/competiano.entity";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import selectMemberName from './../../../selectMenus/compet/selectMemberName.json';
import { nextPage } from "@/bot/selectMenus/compet/selectMenuList";
import { handleRemoveFromTrelloInteraction } from "../trello/removeFromTrello";
import { handleRemoveFromDiscordInteraction } from "../kickMember/kickMember";

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

        //await handleRemoveFromTrelloInteraction(interaction);
        await handleRemoveFromDiscordInteraction(interaction);
    }
})

interface ExtractDataRequest {
    competianos: CompetianoType[]
}

interface ExtractDataResponse {
    email: string,
    nome: string
}

async function extractData({ competianos }: ExtractDataRequest): Promise<ExtractDataResponse[]> {
    // Filter active competianos
    const activeCompetianos: ExtractDataResponse[] = competianos.filter(competiano => competiano.membro_ativo === true)
                                         .filter(competiano => !competiano.tutor)
                                         .map(competiano => ({ nome: competiano.nome, email: competiano.email }));
    return activeCompetianos;
}
