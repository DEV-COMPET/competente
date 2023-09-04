import { ChatInputApplicationCommandData } from "discord.js";
import { Command } from "../../structures/Command";
import { updateTalks } from "../../utils/googleAPI/updateCompetTalks";
import { readJsonFile } from "@/bot/utils/json";
import { makeEmbed } from "@/bot/utils/embed/makeEmbed";

const data: ChatInputApplicationCommandData = readJsonFile({ 
    dirname: __dirname, 
    partialPath: "json/new-talks-forms.json" 
});

export default new Command({
    name: data.name,
    description: data.description,
    options: data.options,
    run: async ({ interaction }) => {
        const member = await interaction.guild?.members.fetch( interaction.user.id );
        const isADM = member?.permissions.has("Administrator");

        if (isADM) {
            const title = interaction.options.get("title")?.value as string;

            await updateTalks(title);

            return await interaction.reply({
                content: "Titulo do Forms Alterado. Link do forms: https://docs.google.com/forms/d/e/1FAIpQLSeh2F82mKd8t6RAXuXdKU7kQiGxButW8xNK8FZSF4wCO-ZuHQ/viewform",
                ephemeral: true,
            });
        }

        const errorEmbed = makeEmbed({
            json: {
                dirname: __dirname,
                partialPath: "json/new-talks-embed-error.json"
            }
        })

        return await interaction.reply({
            content: "Não foi possível executar este comando",
            ephemeral: true,
            embeds: [errorEmbed],
        });
    },
});
