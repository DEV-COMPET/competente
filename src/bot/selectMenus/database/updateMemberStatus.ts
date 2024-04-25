import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './updateMemberStatus.json';
import { previousPage, currentPage, nextPage, getElementsPerPage, selectMenuList } from "./selectMenuList";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

export default new SelectMenu({
    customId,

    run: async({ interaction }) => {
        const memberToBeRemovedNome = interaction.values[0];
        await interaction.deferReply({ ephemeral: true });
        console.log("Member to be removed: ", memberToBeRemovedNome);

        if(memberToBeRemovedNome == nextPage.nome.toString()) {
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
        else if(memberToBeRemovedNome == previousPage.nome.toString()) {
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

        const url = "/competianos/" + memberToBeRemovedNome;

        console.log("URL de atualização********************");
        console.log(url);
        const quitMemberResponse = await fetchDataFromAPI({
            json: true, method: "PUT", url: url,
            bodyData: { membro_ativo: false, data_fim: new Date() }
        });

        if (quitMemberResponse.isLeft())
            return await editErrorReply({
                error: quitMemberResponse.value.error, interaction,
                title: "Não foi possivel remover o competiano"
            })

        return await editSucessReply({
            interaction, title: `Competiano '${memberToBeRemovedNome}' removido com sucesso`
        })
    }
})