import { readJsonFileRequest } from "../json";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { makeEmbed } from "./makeEmbed";

export interface makeEmbedRequest {
    json?: readJsonFileRequest
    interaction: ExtendedModalInteraction
    error: {
        code: number,
        message: string
    }
}

export function makeSuccessEmbed({ interaction, error, json }: makeEmbedRequest) {

    const { code, message } = error

    if (json) {
        return makeEmbed({
            data: {
                author: {
                    name: interaction.user.username.replaceAll("_", " ") || "abc",
                    iconURL: interaction.user.avatarURL() || undefined,
                },
                fields: [
                    {
                        name: "Código do erro",
                        value: code.toString(),
                        inline: false,
                    },
                    {
                        name: "Mensagem do erro",
                        value: message,
                        inline: false,
                    },
                ],
            },
            json
        })
    }

    return makeEmbed({
        data: {
            author: {
                name: interaction.user.username.replaceAll("_", " ") || "abc",
                iconURL: interaction.user.avatarURL() || undefined,
            },
            fields: [
                {
                    name: "Código do erro",
                    value: code.toString(),
                    inline: false,
                },
                {
                    name: "Mensagem do erro",
                    value: message,
                    inline: false,
                },
            ],
        },
    })
}