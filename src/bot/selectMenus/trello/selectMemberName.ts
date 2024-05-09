import { env } from '@/env';
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './selectMemberName.json';
import { ComponentType } from "discord.js";
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';
import { editErrorReply } from '@/bot/utils/discord/editErrorReply';
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { getAllMembersInfo } from '@/bot/utils/trello/getAllMembersInfo';
import { previousPage, nextPage, getElementsPerPage, currentPage, selectMenuList } from './selectMenuList';

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const memberToBeRemovedId = interaction.values[0];

        if(memberToBeRemovedId == nextPage.id.toString()) {
            currentPage.push(currentPage[currentPage.length-1] + 1);
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
                  label: member.fullName,
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
            //console.log("current page", currentPage[currentPage.length - 1]);
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
                  label: member.fullName,
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

        const boardId = env.TRELLO_BOARD_ID;
        const boardIds = [ boardId ];

        const memberToBeRemoved = await (await getAllMembersInfo(boardId)).filter(member => member.id === memberToBeRemovedId)[0];

        const admBoardId = env.TRELLO_ADM_BOARD_ID;
        const memberToBeRemoved_ADM = await (await getAllMembersInfo(admBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_ADM) boardIds.push(admBoardId);

        const devBoardId = env.TRELLO_DEV_BOARD_ID;
        const memberToBeRemoved_DEV = await (await getAllMembersInfo(devBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_DEV) boardIds.push(devBoardId);

        const eventosBoardId = env.TRELLO_EVENTOS_BOARD_ID;
        const memberToBeRemoved_EVENTOS = await (await getAllMembersInfo(eventosBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_EVENTOS) boardIds.push(eventosBoardId);

        const marketingBoardId = env.TRELLO_MARKETING_BOARD_ID;
        const memberToBeRemoved_MARKETING = await (await getAllMembersInfo(marketingBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_MARKETING) boardIds.push(marketingBoardId);

        const fetchPromises: Promise<Response>[] = [];

        // Execute fetch for each boardId in parallel
        boardIds.forEach(boardId => {
            fetchPromises.push(
                fetch(`https://api.trello.com/1/boards/${boardId}/members/${memberToBeRemovedId}?key=${env.TRELLO_API_KEY}&token=${env.TRELLO_ACCOUNT_TOKEN}`, {
                    method: 'DELETE'
                }).then(response => response.json())
            );
        });

        // Await all fetch operations
        await Promise.all(fetchPromises);

        await editSucessReply({
            interaction,
            title: 'Membro removido do Trello',
            fields: [
                {
                    name: 'Nome',
                    value: memberToBeRemoved.fullName,
                    inline: false
                },
                {
                    name: 'Id',
                    value: memberToBeRemoved.id,
                    inline: false
                }
            ],
        }).catch(err => {
            console.error(err);
            return editErrorReply({
                error: err,
                interaction,
                title: 'Não foi possível excluir o membro do Trello'
            });
        });
    }
})