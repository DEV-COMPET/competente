import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId} from "@/bot/selectMenus/addToCompet/selectTeam/selectTeamMenuData.json";
import { competianoChosen } from "../variable/competianoChosen";
import { giveMemberRole } from "../utils/giveMemberRole";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";


export default new SelectMenu ({
    customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true });
        
        const roleName = interaction.values[0];

        const giveMemberRoleReponse = await giveMemberRole({ interaction, roleName, competiano: competianoChosen[competianoChosen.length - 1] });
        if (giveMemberRoleReponse.isLeft()) {
            return await editErrorReply({
                interaction,
                title: "Não foi possível adicionar o cargo ao competiano",
                error: giveMemberRoleReponse.value.error
            });
        };

        await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Cargo adicionado com sucesso",
                    interaction
                })
            ]
        });
    }
})