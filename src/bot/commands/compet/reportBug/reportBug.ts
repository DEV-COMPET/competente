import { Command } from "@/bot/structures/Command";
import { readJsonFile } from "@/bot/utils/json";
import { ChatInputApplicationCommandData } from "discord.js";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "reportBugInput.json"
});

export default new Command({
    name,
    description,
    run: async ({ interaction }) => {
        await interaction.reply({
            content:
                "Para reportar algum bug do bot do Discord, basta acessar o link https://forms.gle/sygn7fN6tUHWGPLj6",
            ephemeral: true,
        });
    },
});
