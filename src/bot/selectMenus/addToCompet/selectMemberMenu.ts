import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectMemberMenuData.json";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { createSelectRoleMenu } from "./utils/createSelectRoleMenu";
import { competianoChosen } from "./variable/competianoChosen";
// import { memberSelect } from "./variables/memeberSelected";

export interface RoleData {
    id: string,
    name: string
}

export default new SelectMenu ({
    customId,
    run: async ({ interaction }) => {

        const member = interaction.values[0];

        competianoChosen.push(member);


        const guild = interaction.guild;
        if(!guild) 
            throw "Guild not cached";

        const roles = await guild.roles.fetch();

        const rolesData: RoleData[] = roles.map(role => {
            const { id, name } = role;

            return { id, name };
        });

        const selectRoleMenu = createSelectRoleMenu( { rolesData });

        await interaction.reply({
            content: 'Agora informe o cargo do novo competiano',
            components: [await makeStringSelectMenuComponent(selectRoleMenu)],
            ephemeral: true
        });

    }
})