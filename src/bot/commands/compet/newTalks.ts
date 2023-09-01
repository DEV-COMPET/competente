import { ChatInputApplicationCommandData, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { updateTalks } from "../../utils/googleAPI/updateCompetTalks";
import { readJsonFile } from "@/bot/utils/json";

const data: ChatInputApplicationCommandData = readJsonFile(__dirname, "json/new-talks-forms.json");

export default new Command({
    name: data.name,
    description: data.description,
    options: data.options,
    run: async ({ interaction }) => {
        const member = await interaction.guild?.members.fetch(
            interaction.user.id
        );
        const isADM = member?.permissions.has("Administrator");

        if (isADM) {
            const email = interaction.options.get("title")?.value as string;

            await updateTalks(email);

            return await interaction.reply({
                content: "Titulo do Forms Alterado: https://docs.google.com/forms/d/e/1FAIpQLSeh2F82mKd8t6RAXuXdKU7kQiGxButW8xNK8FZSF4wCO-ZuHQ/viewform",
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0xf56565)
            .setTitle("Não foi possível utilizar este comando!")
            .setDescription("Você não possui autorização necessária.")
            .setThumbnail(
                "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
            )
            .addFields(
                { name: "Código do erro", value: "401", inline: false },
                {
                    name: "Mensagem do erro",
                    value: "Você precisa ter permissão de administrador para executar esse comando",
                    inline: false,
                }
            );
        return await interaction.reply({
            content: "Não foi possível executar este comando",
            ephemeral: true,
            embeds: [embed],
        });

    },
});
