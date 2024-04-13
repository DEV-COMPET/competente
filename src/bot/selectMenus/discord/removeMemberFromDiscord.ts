import { env } from "@/env";
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './removeMemberFromDiscord.json';
import { ComponentType, EmbedBuilder } from "discord.js";
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';
import { editErrorReply } from '@/bot/utils/discord/editErrorReply';
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { previousPage, nextPage, getElementsPerPage, currentPage, selectMenuList } from './selectMenuList'
import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersInfo";
import { handleRemoveFromTrelloInteraction } from "@/bot/commands/compet/trello/removeFromTrello";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        let memberToBeRemovedId = interaction.values[0]; // TODO: colocar const
        console.log("Member to be removed: ", memberToBeRemovedId);

        if(memberToBeRemovedId == nextPage.globalName.toString()) {
            currentPage.push(currentPage[currentPage.length-1] + 1);
            console.log("current page", currentPage[currentPage.length - 1]);
            const menuOptions = getElementsPerPage(currentPage[currentPage.length-1]);
            
            menuOptions.push(previousPage);

            let size: number;
            const currentPageNumber = currentPage[currentPage.length - 1];
            if(currentPageNumber == 1)
                size = 24;
            else {
                size = 24 + 23 * (currentPageNumber - 1);
            }

            if(selectMenuList.length > size)
                menuOptions.push(nextPage);

            const nameMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options: menuOptions.map(member => ({
                  label: member.globalName,
                  value: member.id.toString(),
                })),
                maxValues: minMax.max,
                minValues: minMax.min,
            });
        
            await interaction.editReply({
            content: 'Selecione o membro a ser removido',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        else if(memberToBeRemovedId == previousPage.id.toString()) {
            currentPage.push(currentPage[currentPage.length-1] - 1);
            console.log("current page", currentPage[currentPage.length - 1]);
            const menuOptions = getElementsPerPage(currentPage[currentPage.length-1]);

            let size: number;
            const currentPageNumber = currentPage[currentPage.length - 1];
            if(currentPageNumber == 1)
                size = 24;
            else {
                size = 24 + 23 * (currentPageNumber - 1);
            }

            if(currentPageNumber != 1)
                menuOptions.push(previousPage);
            if(selectMenuList.length > size)
                menuOptions.push(nextPage);

            const nameMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options: menuOptions.map(member => ({
                  label: member.globalName,
                  value: member.id.toString(),
                })),
                maxValues: minMax.max,
                minValues: minMax.min,
            });
        
            await interaction.editReply({
            content: 'Selecione o membro a ser removido',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        console.log("AQUI");
        await kickUser(memberToBeRemovedId, interaction);

    }

    
})

// TODO: fazer um modal para adicionar a justificativa de remoção do Discord
export async function kickUser(userId: string, interaction: ExtendedStringSelectMenuInteraction) {
    const targetUser = await interaction.guild?.members.fetch(`${userId}`);

    try {
        if (!targetUser) {
            await interaction.editReply("Não foi possível encontrar o usuario no servidor ");
                return;
            }
    
            if (targetUser.id === interaction.guild?.ownerId) {
            await interaction.editReply("Você não pode *expulsar* o dono do servidor!");
                return;
            }
    } catch (error) {
        await interaction.editReply("Erro ao executar o comando");
        return ;
    }

    try {
        await targetUser.kick();
        const embed = new EmbedBuilder().setTitle(`Remoção de ${targetUser.displayName}`);
        embed.addFields(
            {name: "Usuário: ", value: `${targetUser}`},
            {name: "Motivo: ", value: `Nenhuma Justificativa`}
        );
        await interaction.editReply({embeds: [embed]});

    } catch (error) {
        const embed = new EmbedBuilder().setTitle(`Remoção de ${targetUser.displayName}`);
        embed.addFields(
            {name: "Erro: ", value: `Erro ao kickar ${targetUser}`},
        );
        await interaction.editReply({ embeds: [embed] });
        console.log(`Erro ao tentar kickar usuario ${error}`);
    }
}