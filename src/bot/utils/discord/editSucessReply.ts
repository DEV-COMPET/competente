import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { makeSuccessEmbed } from "../embed/makeSuccessEmbed"

interface EditSucessReplyRequest {
    interaction: ExtendedModalInteraction
    title: string
}

export async function editSucessReply({ interaction, title }: EditSucessReplyRequest) {
    return await interaction.editReply({
        embeds: [
            makeSuccessEmbed({
                title,
                interaction,
            })
        ]
    })
}