import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './updateMemberStatus.json';
import { previousPage, currentPage, nextPage, getElementsPerPage, selectMenuList } from "./selectMenuList";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";

export default new SelectMenu({
    customId,

    run: async({ interaction }) => {
        const memberToBeRemovedId = interaction.values[0];
        console.log("Member to be removed: ", memberToBeRemovedId);

        if(memberToBeRemovedId == nextPage.nome.toString()) {
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
        else if(memberToBeRemovedId == previousPage.nome.toString()) {
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

        console.log("MEMBRO ATUALIZAR O BD$##################");
        console.log(memberToBeRemovedId);
    }
})