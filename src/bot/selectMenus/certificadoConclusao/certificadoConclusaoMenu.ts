import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './certificadoConclusaoMenuData.json';
import { customId as customIdDiscord, minMax as minMaxDiscord } from './certificadoConclusaoMenuData.json'
import { previousPage, currentPage, nextPage, getElementsPerPage, selectMenuList, cancelOption } from "../compet/selectMenuList";
import { currentPage as currentPageDiscord, nextPage as nextPageDiscord,
            getElementsPerPage as getElementsPerPageDiscord, selectMenuList as selectMenuListDiscord } from "../discord/selectMenuList";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";
import { getDiscordMembers } from "@/bot/modals/compet/removeFromDrive/removeFromDriveModal";
import { dataMembrosModal } from "@/bot/modals/compet/certificadoConclusaoModal/certificadoConclusaoModal";

const selectedMembers: string[] = [];

export default new SelectMenu({
    customId,

    run: async({ interaction }) => {
        const selectMember = interaction.values[0];
        console.log("Menu dataMembros executed");
        selectedMembers.push(selectMember);

        // próxima página
        if(selectMember == nextPage.nome.toString() + "$$$" + nextPage.email) {
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
            menuOptions.push(cancelOption);

            const nameMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options: menuOptions.map(member => ({
                  label: member.nome,
                  value: member.nome + "$$$" + member.email,
                })),
                maxValues: minMax.max,
                minValues: minMax.min,
            });
        
            await interaction.editReply({
            content: 'Selecione o membro',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        // página anterior
        else if(selectMember == previousPage.nome.toString() + "$$$" + previousPage.email) {
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
            menuOptions.push(cancelOption);

            const nameMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options: menuOptions.map(member => ({
                  label: member.nome,
                  value: member.nome + "$$$" + member.email,
                })),
                maxValues: minMax.max,
                minValues: minMax.min,
            });
        
            await interaction.editReply({
            content: 'Selecione o membro',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        else if(selectMember === cancelOption.nome + "$$$" + cancelOption.email) { // nenhuma opção
            const filteredExtractedMembers = await getDiscordMembers();

            const filteredExtractedMembersNotNull = filteredExtractedMembers.filter(member => member.globalName !== null)
                                                    .map(member => ({
                                                        id: member.id,
                                                        username: member.username,
                                                        globalName: member.globalName!
                                                    }));
            selectMenuListDiscord.length = 0;
            selectMenuListDiscord.push(...filteredExtractedMembersNotNull);
            const menuOptions = getElementsPerPageDiscord(currentPageDiscord[currentPageDiscord.length-1]);

            if(filteredExtractedMembersNotNull.length > 24)
                menuOptions.push(nextPageDiscord);
    
            if(filteredExtractedMembers.length > 0) {
                const nameMenu = makeStringSelectMenu({
                    customId: customIdDiscord,
                    type: ComponentType.StringSelect,
                    options: menuOptions.map(member => ({
                        label: member.globalName!,
                        value: member.id
                    })),
                    maxValues: minMaxDiscord.max,
                    minValues: minMaxDiscord.min,
                });
        
                return await interaction.editReply({
                content: 'Selecione o membro',
                components: [await makeStringSelectMenuComponent(nameMenu)]
                });
            }
        }
        else {
        return await interaction.showModal(dataMembrosModal)
        }
    }
})

export { selectedMembers };