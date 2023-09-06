import { ChatInputApplicationCommandData, InteractionReplyOptions } from "discord.js";
import { Command } from "../../../structures/Command";
import { updateTalks } from "../../../utils/googleAPI/updateCompetTalks";
import { readJsonFile } from "@/bot/utils/json";
import { makeNotAdminEmbed } from "@/bot/utils/embed/makeNotAdminEmbed";

const { name, description, options }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "new-talks-forms.json"
});

export default new Command({
    name, description, options,
    run: async ({ interaction }) => {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        const isADM = member?.permissions.has("Administrator");

        if (!isADM)
            return makeNotAdminEmbed(interaction)

        const title = interaction.options.get("title")?.value as string;
        await updateTalks(title);

        const { content, ephemeral }: InteractionReplyOptions = readJsonFile({
            dirname: __dirname,
            partialPath: "interactionReply.json"
        });

        return await interaction.reply({ content, ephemeral });
    },
});
