import { env } from '@/env'
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from './selectTeam.json';
import { export_email as email } from "@/bot/modals/compet/addMemberToTrello/addMemberToTrelloModal";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { addMemberToTrelloBoard } from './utils/addMemberToTrelloBoard';
import { editErrorReply } from '@/bot/utils/discord/editErrorReply';

export default new SelectMenu( {
    customId,

    run: async({ interaction }) => {
        await interaction.deferReply();

        const memberTeam = interaction.values[0];
        console.log('the member team is', memberTeam);

        if(memberTeam == 'Administração') {
            try {
                const memberTeamTrelloBoard = env.TRELLO_ADM_BOARD_ID;
                const { status } = await addMemberToTrelloBoard(memberTeamTrelloBoard, email);
                if(status == 'OK') {
                    return editSucessReply({
                        interaction, title: `Competiano adicionado ao Trello de ${memberTeam} do COMPET!`,
                        fields: [
                            {
                                name: "E-mail",
                                value: email,
                                inline: false
                            },
                            {
                                name: 'Equipe',
                                value: memberTeam,
                                inline: false
                            }
                        ],
                    });
                }
            }
            catch (err: Error) {
                return editErrorReply({
                    error: err, interaction,
                    title: "Não foi possível adicionar o competiano ao Trello"
                });
            }
        }
        else if(memberTeam == 'Desenvolvimento') {

        }
        else if(memberTeam == 'Eventos') {

        }
        else {

        }
    }
})