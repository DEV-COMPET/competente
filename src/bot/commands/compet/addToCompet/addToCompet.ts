import { Command } from "@/bot/structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";

import { addToCompetModal } from "@/bot/modals/compet/addToCompet/addToCompetModal";
import { name, description } from "@/bot/commands/compet/addToCompet/addToCompetInput.json"

interface SociaMediaData {
    instagram: string | ""
    linkedin: string | "",
}

export const socialMedia: SociaMediaData = {
    instagram: "",
    linkedin: ""
}

export default new Command({
    name, description,
    options: [
        {
            name: 'linkedin',
            description: "Linkedin do novo competiano (caso tenha)",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'instagram',
            description: "Instagram do novo competiano (caso tenha)",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async ({ interaction }) => {

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response;

        socialMedia.linkedin = interaction.options.get('linkedin')?.value as string || " ";
        socialMedia.instagram = interaction.options.get('instagram')?.value as string || " ";

        await interaction.showModal(addToCompetModal);

    }
})