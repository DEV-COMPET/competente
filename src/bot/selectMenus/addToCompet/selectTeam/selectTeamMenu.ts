import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId} from "@/bot/selectMenus/addToCompet/selectTeam/selectTeamMenuData.json";


export default new SelectMenu ({
    customId,

    run: async ({ interaction }) => {
        
        const roleName = interaction.values[0];

        console.log(roleName);
    }
})