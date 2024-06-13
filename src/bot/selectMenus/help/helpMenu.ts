import * as path from 'path';
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { EmbedField } from "discord.js";
import { customId } from './helpMenuData.json';
import { getDescription } from "@/bot/commands/compet/help/utils/getMarkdownFileDescrition";
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';
import { getStepByStep } from '@/bot/commands/compet/help/utils/getMarkdownFileStepByStepSection';

export default new SelectMenu({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        const selectedOption = interaction.values[0];

        const projectRoot = process.cwd(); // Diretório raiz do projeto
        const docsFolder = path.join(projectRoot, 'docs') + '/' + selectedOption + '.md';
        const description = getDescription(docsFolder);
        const descriptionWithoutImagesAndLinks = removeImagesAndLinks(description);
        const stepByStep = getStepByStep(docsFolder);
        const stepByStepWithoutImagesAndLinks = removeImagesAndLinks(stepByStep);
        
        const descriptionFields = createFieldsFromLongText(descriptionWithoutImagesAndLinks, "Descrição");
        const stepByStepFields = createFieldsFromLongText(stepByStepWithoutImagesAndLinks, "Passo a passo");

        const fields = descriptionFields.concat(stepByStepFields);

        const duvidaContato = {
            name: "Alguma dúvida?",
            value: `Caso ainda reste alguma dúvida, entre na documentação do bot 
            presente no GitHub do competente ou entre em contato com
            algum membro de desenvolvimento`,
            inline: false
        };
        fields.push(duvidaContato);

        return await editSucessReply({
            interaction,
            title: `Ajuda no comando /${selectedOption}`,
            fields
        });
    }
});

function createFieldsFromLongText(text: string, fieldName: string): EmbedField[] {
    const maxLength = 1024;
    const fields: EmbedField[] = [];

    for (let i = 0; i < text.length; i += maxLength) {
        const fieldValue = text.substring(i, i + maxLength);
        fields.push({
            name: fieldName,
            value: fieldValue,
            inline: false
        });
    }

    return fields;
}

function removeImagesAndLinks(text: string): string {
    // Remove imagens
    const withoutImages = text.replace(/!\[.*?\]\(.*?\)/g, '');
    
    // Remove links
    const withoutLinks = withoutImages.replace(/\[.*?\]\(.*?\)/g, '');

    return withoutLinks;
}