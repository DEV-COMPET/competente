import * as path from 'path';
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { ComponentType } from "discord.js";
import { customId } from './helpMenuData.json';
import { getDescription } from "@/bot/commands/compet/help/utils/getMarkdownFileDescrition";
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';

export default new SelectMenu({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        const selectedOption = interaction.values[0];
        console.log("the selected options is", selectedOption);

        const projectRoot = process.cwd(); // Diretório raiz do projeto
        const docsFolder = path.join(projectRoot, 'docs') + '/' + selectedOption + '.md';
        const description = getDescription(docsFolder);
        console.log("descriptions is", description);
        const fields = [
            {
                name: "Descrição",
                value: description,
                inline: false
            },
            {
                name: "Passo a passo",
                value: "passo a passo",
                inline: false
            }
        ];

        return await editSucessReply({interaction, title: `Ajuda no comando ${selectedOption}`,
                            fields
        });
    }
});