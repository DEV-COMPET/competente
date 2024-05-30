import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './updateMemberStatus.json';
import { customId as customIdDiscord, minMax as minMaxDiscord } from '../discord/removeMemberFromDiscord.json'
import { previousPage, currentPage, nextPage, getElementsPerPage, selectMenuList, cancelOption } from "./../compet/selectMenuList";
import { currentPage as currentPageDiscord, nextPage as nextPageDiscord,
            getElementsPerPage as getElementsPerPageDiscord, selectMenuList as selectMenuListDiscord } from "./../discord/selectMenuList";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { getDiscordMembers, handleRemoveFromDriveInteraction } from "@/bot/modals/compet/removeFromDrive/removeFromDriveModal";
import { removeFromTrello } from "../discord/removeMemberFromDiscord";
import { updateSheetsDataGivenTheMemberName } from "@/bot/utils/googleAPI/updateSheetsData";

export default new SelectMenu({
    customId,

    run: async({ interaction }) => {
        const memberToBeRemovedNomeEmail = interaction.values[0];
        await interaction.deferReply({ ephemeral: true });

        // próxima página
        if(memberToBeRemovedNomeEmail == nextPage.nome.toString() + "$$$" + nextPage.email) {
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
            content: 'Selecione o membro a ser removido',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        // página anterior
        else if(memberToBeRemovedNomeEmail == previousPage.nome.toString() + "$$$" + previousPage.email) {
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
            content: 'Selecione o membro a ser removido',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
            return;
        }
        else if(memberToBeRemovedNomeEmail === cancelOption.nome + "$$$" + cancelOption.email) { // nenhuma opção
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
                content: 'Selecione o membro a ser removido do Discord',
                components: [await makeStringSelectMenuComponent(nameMenu)]
                });
            }
            else // sem membro no Discord, logo vamos remover do Trello diretamente
                return await removeFromTrello(interaction);
        }
        else {
            const nome_email = memberToBeRemovedNomeEmail.split('$$$');
            const memberToBeRemovedNome = nome_email[0];
            const memberToBeRemovedEmail = nome_email[1];
            await updateSheetsDataGivenTheMemberName(memberToBeRemovedNome);

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
    }
})