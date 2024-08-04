import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { makeSuccessEmbed } from "../embed/makeSuccessEmbed"
import { APIEmbedField } from "discord.js"
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu"
import { ExtendedInteraction } from "@/bot/typings/Commands"
import { ExtendedButtonInteraction } from "@/bot/typings/Button"

interface EditSucessReplyRequest {
    interaction: ExtendedModalInteraction | ExtendedStringSelectMenuInteraction | ExtendedInteraction | ExtendedButtonInteraction
    title: string
    fields?: APIEmbedField[]
    url_imagem?: string
}

export async function editSucessReply({ interaction, title, fields, url_imagem }: EditSucessReplyRequest) {
    return await interaction.editReply({
        embeds: [
            makeSuccessEmbed({
                title,
                interaction,
                fields,
                url_imagem
            })
        ]
    })
}

export async function sucessReply({ interaction, title, fields, url_imagem }: EditSucessReplyRequest) {
    return await interaction.reply({
        embeds: [
            makeSuccessEmbed({
                title,
                interaction,
                fields,
                url_imagem
            })
        ],
        ephemeral: true
    })
}