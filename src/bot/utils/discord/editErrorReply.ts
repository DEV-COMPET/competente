import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { makeErrorEmbed } from "../embed/makeErrorEmbed"
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu"
import { ExtendedButtonInteraction } from "@/bot/typings/Button";

interface EditErrorReplyRequest {
    error: Error
    interaction: ExtendedModalInteraction | ExtendedInteraction | ExtendedStringSelectMenuInteraction | ExtendedButtonInteraction
    title: string
}

export async function editErrorReply({ error, interaction, title }: EditErrorReplyRequest) {
    console.error(error)
    return await interaction.editReply({
        embeds: [
            makeErrorEmbed({
                title, interaction,
                error: { code: 401, message: error.message },
            })
        ]
    })
}