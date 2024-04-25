import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './updateMemberStatus.json';
import { previousPage, currentPage, nextPage, getElementsPerPage, selectMenuList, cancelOption } from "./selectMenuList";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { handleRemoveFromDriveInteraction } from "@/bot/modals/compet/removeFromDrive/removeFromDriveModal";

export default new SelectMenu({
    customId,

    run: async({ interaction }) => {
        const memberToBeRemovedNomeEmail = interaction.values[0];
        await interaction.deferReply({ ephemeral: true });

        // próxima página
        if(memberToBeRemovedNomeEmail == nextPage.nome.toString()) {
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
        // página anterior
        else if(memberToBeRemovedNomeEmail == previousPage.nome.toString()) {
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
        else if(memberToBeRemovedNomeEmail === cancelOption.nome) {
            return await editSucessReply({
                interaction, title: 'Operação cancelada'
            });
        }
        const nome_email = memberToBeRemovedNomeEmail.split('$$$');
        const memberToBeRemovedNome = nome_email[0];
        const memberToBeRemovedEmail = nome_email[1];
        const url = "/competianos/" + memberToBeRemovedNome;

        const quitMemberResponse = await fetchDataFromAPI({
            json: true, method: "PUT", url: url,
            bodyData: { membro_ativo: false, data_fim: new Date() }
        });

        if (quitMemberResponse.isLeft()) {
            await editErrorReply({
                error: quitMemberResponse.value.error, interaction,
                title: "Não foi possivel atualizar o status do competiano no banco de dados"
            });

            // remover do drive
            await handleRemoveFromDriveInteraction(interaction, { emails: memberToBeRemovedEmail });
        }
        else {
            await editSucessReply({
                interaction, title: `Status do membro '${memberToBeRemovedNome}' atualizado com sucesso`
            });

            // remover do drive
            await handleRemoveFromDriveInteraction(interaction, { emails: memberToBeRemovedEmail });
        }
    }
})