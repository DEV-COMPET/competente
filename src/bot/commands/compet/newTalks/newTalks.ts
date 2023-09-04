import { ChatInputApplicationCommandData, InteractionReplyOptions } from "discord.js";
import { Command } from "../../../structures/Command";
import { updateTalks } from "../../../utils/googleAPI/updateCompetTalks";
import { readJsonFile } from "@/bot/utils/json";
import { makeEmbed } from "@/bot/utils/embed/makeEmbed";

const { name, description, options }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "new-talks-forms.json"
});

export default new Command({
    name, description, options,
    run: async ({ interaction }) => {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        const isADM = member?.permissions.has("Administrator");

        if (!isADM) {

            const errorEmbed = makeEmbed({
                json: {
                    dirname: __dirname,
                    partialPath: "new-talks-embed-error.json"
                }
            })

            return await interaction.reply({
                content: "Não foi possível executar este comando",
                ephemeral: true,
                embeds: [errorEmbed],
            });
        }

        const title = interaction.options.get("title")?.value as string;
        const result = await updateTalks(title);

        console.log(result)

        const { content, ephemeral }: InteractionReplyOptions = readJsonFile({
            dirname: __dirname,
            partialPath: "interactionReply.json"
        });
        
        return await interaction.reply({ content, ephemeral });
    },
});
