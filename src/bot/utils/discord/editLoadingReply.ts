import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { makeLoadingEmbed } from "../embed/makeLoadingEmbed"
import { ExtendedInteraction } from "@/bot/typings/Commands"

interface EditLoadingReplyRequest {
    interaction: ExtendedModalInteraction | ExtendedInteraction
    title: string
}

export async function editLoadingReply({ interaction, title }: EditLoadingReplyRequest) {
    await interaction.editReply({
        embeds: [
            makeLoadingEmbed({
                title, interaction,
            })
        ]
    })
}