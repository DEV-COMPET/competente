import { env } from "@/env";
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './removeMemberFromDiscord.json';
import { ComponentType, EmbedBuilder } from "discord.js";
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';
import { editErrorReply } from '@/bot/utils/discord/editErrorReply';

import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { previousPage as previousPageDiscord, nextPage as nextPageDiscord, 
    getElementsPerPage, currentPage as currentPageDiscord, 
    selectMenuList as selectMenuListDiscord } from './selectMenuList'
import { nextPage as nextPageTrello, selectMenuList as selectMenuListTrello } from "../trello/selectMenuList";

import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersInfo";
import { handleRemoveFromTrelloInteraction } from "@/bot/commands/compet/trello/removeFromTrello";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";
import { handlingRemove } from "@/bot/commands/compet/removeFromCompet/utils/handleRemove";
import { removeFromDriveModal } from "@/bot/modals/compet/removeFromDrive/removeFromDriveModal";
import selectMemberName from "../trello/selectMemberName.json";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        let memberToBeRemovedId = interaction.values[0]; // TODO: colocar const
        console.log("Member to be removed: ", memberToBeRemovedId);

        if(memberToBeRemovedId == nextPageDiscord.globalName.toString()) {
            currentPageDiscord.push(currentPageDiscord[currentPageDiscord.length-1] + 1);
            console.log("current page", currentPageDiscord[currentPageDiscord.length - 1]);
            const menuOptions = getElementsPerPage(currentPageDiscord[currentPageDiscord.length-1]);
            
            menuOptions.push(previousPageDiscord);

            let size: number;
            const currentPageNumber = currentPageDiscord[currentPageDiscord.length - 1];
            if(currentPageNumber == 1)
                size = 24;
            else {
                size = 24 + 23 * (currentPageNumber - 1);
            }

            if(selectMenuListDiscord.length > size)
                menuOptions.push(nextPageDiscord);

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
        else if(memberToBeRemovedId == previousPageDiscord.id.toString()) {
            currentPageDiscord.push(currentPageDiscord[currentPageDiscord.length-1] - 1);
            console.log("current page", currentPageDiscord[currentPageDiscord.length - 1]);
            const menuOptions = getElementsPerPage(currentPageDiscord[currentPageDiscord.length-1]);

            let size: number;
            const currentPageNumber = currentPageDiscord[currentPageDiscord.length - 1];
            if(currentPageNumber == 1)
                size = 24;
            else {
                size = 24 + 23 * (currentPageNumber - 1);
            }

            if(currentPageNumber != 1)
                menuOptions.push(previousPageDiscord);
            if(selectMenuListDiscord.length > size)
                menuOptions.push(nextPageDiscord);

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
        await removeFromTrello(interaction);
        

        // Remove from Trello
        //const prev_interaction = handlingRemove[handlingRemove.length-1];
        //await handleRemoveFromTrelloInteraction(prev_interaction);
    }

    
})

async function removeFromTrello(interaction: ExtendedStringSelectMenuInteraction) {
    try {
        const trelloGeralBoardId = env.TRELLO_BOARD_ID;
        const getAllMembersInfoResponse = await getAllMembersInfo(trelloGeralBoardId);
        const { customId, minMax } = selectMemberName;
  
        let menuOptions = getAllMembersInfoResponse;
        selectMenuListTrello.splice(0, selectMenuListTrello.length, ...menuOptions);
  
        console.log(menuOptions);
  
        if(menuOptions.length > 25) { // split
          menuOptions = menuOptions.slice(0, 24);
          menuOptions.push(nextPageTrello);
        }
  
        const nameMenu = makeStringSelectMenu({
          customId,
          type: ComponentType.StringSelect,
          options: menuOptions.map(member => ({
            label: member.fullName,
            value: member.id.toString(),
          })),
          maxValues: minMax.max,
          minValues: minMax.min,
        });
  
        await interaction.editReply({
          content: 'Selecione o membro a ser removido do Trello',
          components: [await makeStringSelectMenuComponent(nameMenu)]
        });
        console.log("Opa, chegou aqui após Trello******************************");
        // await interaction.showModal(removeFromDriveModal);
      }
      catch(error) {
        console.log(error);
      }
}

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