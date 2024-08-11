import * as path from 'path';
import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { getMarkdownFiles } from "./utils/getMarkdownFiles";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from '@/bot/utils/modal/makeSelectMenu';
import { customId, minMax } from './../../../selectMenus/help/helpMenuData.json';

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "helpInput.json"
});

export default new Command({
    name, description,
    run: async function ({ interaction }) {
        await interaction.deferReply({ ephemeral: true });

        const projectRoot = process.cwd(); // Diretório raiz do projeto
        const docsFolder = path.join(projectRoot, 'docs'); // Caminho para a pasta "docs"
        const markdownFiles = getMarkdownFiles(docsFolder);
        const validMarkdownFiles = markdownFiles.filter(file => file !== 'docs');

        const menuOptions = makeStringSelectMenu({
            customId,
            type: ComponentType.StringSelect,
            options: validMarkdownFiles.map(file => ({
                label: file, value: file
            })),
            maxValues: minMax.max,
            minValues: minMax.min,
        });

        await interaction.editReply({
            content: "Comandos disponíveis:",
            components: [await makeStringSelectMenuComponent(menuOptions)],
        });
    }
})