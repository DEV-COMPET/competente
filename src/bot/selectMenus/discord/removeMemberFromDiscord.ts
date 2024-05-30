import { env } from "@/env";
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './removeMemberFromDiscord.json';
import { ComponentType } from "discord.js";

import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { previousPage as previousPageDiscord, nextPage as nextPageDiscord, 
    getElementsPerPage, currentPage as currentPageDiscord, 
    selectMenuList as selectMenuListDiscord, 
    cancelOption} from './selectMenuList'
import { nextPage as nextPageTrello, selectMenuList as selectMenuListTrello, 
            getElementsPerPage as getElementsPerPageTrello,
            currentPage as currentPageTrello } from "../trello/selectMenuList";

import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersInfo";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";
import selectMemberName from "../trello/selectMemberName.json";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const memberToBeRemovedId = interaction.values[0];
        // próxima página
        if(memberToBeRemovedId == nextPageDiscord.id.toString()) {
            currentPageDiscord.push(currentPageDiscord[currentPageDiscord.length-1] + 1);
            const menuOptions = getElementsPerPage(currentPageDiscord[currentPageDiscord.length-1]);
            
            menuOptions.push(previousPageDiscord);
            menuOptions.push(cancelOption);

            let size: number;
            const currentPageNumber = currentPageDiscord[currentPageDiscord.length - 1];
            if(currentPageNumber == 1)
                size = 23;
            else {
                size = 23 + 23 * (currentPageNumber - 1);
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
            content: 'Selecione o membro a ser removido do Discord',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        // página anterior
        else if(memberToBeRemovedId == previousPageDiscord.id.toString()) {
            currentPageDiscord.push(currentPageDiscord[currentPageDiscord.length-1] - 1);
            const menuOptions = getElementsPerPage(currentPageDiscord[currentPageDiscord.length-1]);
            menuOptions.push(cancelOption);

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
        else if(memberToBeRemovedId === cancelOption.id) {
            return await removeFromTrello(interaction);
        }

        await kickUser(memberToBeRemovedId, interaction);
        await removeFromTrello(interaction);
    }
})

export async function removeFromTrello(interaction: ExtendedStringSelectMenuInteraction | ExtendedModalInteraction) {
    try {
        const trelloGeralBoardId = env.TRELLO_BOARD_ID;
        const getAllMembersInfoResponse = await getAllMembersInfo(trelloGeralBoardId);
        const { customId, minMax } = selectMemberName;
  
        //let menuOptions = getAllMembersInfoResponse;
        const options = getAllMembersInfoResponse;
        selectMenuListTrello.length = 0;
        selectMenuListTrello.push(...options);
        const menuOptions = getElementsPerPageTrello(currentPageTrello[currentPageTrello.length-1]);
  
        if(options.length > 25) { // split
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
        await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: `Remoção de ${targetUser.displayName} do Discord`,
                    fields: [
                        {name: "Usuário: ", value: `${targetUser}`},
                        {name: "Motivo: ", value: `Nenhuma Justificativa`},
                    ],
                    interaction,
                })
            ]
        });

    } catch (error) {
        await interaction.editReply({
            embeds: [
                makeErrorEmbed({
                    title: `Remoção de ${targetUser.displayName}`,
                    error: { code: 404, message: `Erro ao kickar ${targetUser}` },
                    interaction
                })
            ]
        });
        console.log(`Erro ao tentar kickar usuario ${error}`);
    }
}