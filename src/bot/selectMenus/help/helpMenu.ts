import { SelectMenu } from "@/bot/structures/SelectMenu";
import { ComponentType } from "discord.js";
import { customId } from './helpMenuData.json';

export default new SelectMenu({
    customId,
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        const selectedOption = interaction.values[0];
        console.log("the selected options is ", selectedOption);
    }
});