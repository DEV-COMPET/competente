import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { EmbedBuilder } from "discord.js";

export async function makeNotAdminEmbed(interaction: ExtendedInteraction | ExtendedModalInteraction) {
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
                value:
                    "Você precisa ter permissão de administrador para executar esse comando",
                inline: false,
            }
        );

    return await interaction.reply({
        content: "Não foi possível executar este comando",
        ephemeral: true,
        embeds: [embed],
    });
}