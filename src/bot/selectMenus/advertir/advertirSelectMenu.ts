import { SelectMenu } from "@/bot/structures/SelectMenu";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { currentPage, getElementsPerPage, nextPage, previousPage, selectMenuList } from "./selectMenuList";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";
import { customId, minMax } from "./advertirSelectMenuData.json"
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { advertirModalNew } from "@/bot/modals/compet/advertirNew/advertirModal";

export const membroASerAdvertidoSelecionado: string[] = []

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        // await interaction.deferReply({ ephemeral: true });

        const memberToBeAdvertedId = interaction.values[0];

        if (memberToBeAdvertedId == nextPage.nome.toString()) {
            currentPage.push(currentPage[currentPage.length - 1] + 1);
            const menuOptions = getElementsPerPage(currentPage[currentPage.length - 1]);

            menuOptions.push(previousPage);

            let size: number;
            const currentPageNumber = currentPage[currentPage.length - 1];
            if (currentPageNumber == 1)
                size = 24;
            else {
                size = 24 + 23 * (currentPageNumber - 1);
            }

            if (selectMenuList.length > size)
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
                content: 'Selecione o membro a ser advertido',
                components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        else if (memberToBeAdvertedId == previousPage.nome.toString()) {
            currentPage.push(currentPage[currentPage.length - 1] - 1);
            //console.log("current page", currentPage[currentPage.length - 1]);
            const menuOptions = getElementsPerPage(currentPage[currentPage.length - 1]);

            let size: number;
            const currentPageNumber = currentPage[currentPage.length - 1];
            if (currentPageNumber == 1)
                size = 24;
            else {
                size = 24 + 23 * (currentPageNumber - 1);
            }

            if (currentPageNumber != 1)
                menuOptions.push(previousPage);
            if (selectMenuList.length > size)
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
                content: 'Selecione o membro a ser advertido',
                components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        } else if (memberToBeAdvertedId == 'Nenhum$$$-1') {
            return await editErrorReply({
                error: Error('Nenhum membro foi selecionado'),
                interaction, title: 'Nenhum membro foi selecionado'
            })
        }

        membroASerAdvertidoSelecionado.push(memberToBeAdvertedId);
        await interaction.showModal(advertirModalNew)
    }
});