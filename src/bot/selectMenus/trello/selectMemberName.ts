import { env } from '@/env';
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from './selectMemberName.json';
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';
import { editErrorReply } from '@/bot/utils/discord/editErrorReply';
import { getAllMembersInfo } from '@/bot/utils/trello/getAllMembersInfo';

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {
        await interaction.deferReply();

        const memberToBeRemovedId = interaction.values[0];
        const memberToBeRemoved = await (await getAllMembersInfo()).filter(member => member.id === memberToBeRemovedId)[0];

        fetch(`https://api.trello.com/1/boards/${env.TRELLO_BOARD_ID}/members/${memberToBeRemovedId}?key=${env.TRELLO_API_KEY}&token=${env.TRELLO_ACCOUNT_TOKEN}`, {
        method: 'DELETE'
        })
        .then(response => {
            console.log(
            `Response: ${response.status} ${response.statusText}`
            );
            return response.json();
        })
        .then(() => {
            return editSucessReply({
                interaction, title: 'Membro removido do Trello',
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
            });
        })
        .catch(err => {
            console.error(err);
            return editErrorReply({
                error: err, interaction,
                title: 'Não foi possível excluir o membro do Trello'
            });
        });
    }
})