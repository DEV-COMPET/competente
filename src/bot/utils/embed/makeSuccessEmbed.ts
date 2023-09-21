import { readJsonFileRequest } from "../json";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { makeEmbed } from "./makeEmbed";

export interface makeEmbedRequest {
    json?: readJsonFileRequest
    interaction: ExtendedModalInteraction
    description?: string 
    title: string
}

export function makeSuccessEmbed({ interaction, description, json, title }: makeEmbedRequest) {

    return makeEmbed({
        data: {
            title: title ? title : "Ação realizada com sucesso!",
            color: 1683593,
            author: {
                name: interaction.user.username.replaceAll("_", " ") || "abc",
                iconURL: interaction.user.avatarURL() || undefined,
            },
            thumbnail: {
                url: "https://www.pngfind.com/pngs/m/0-226_image-checkmark-green-check-mark-circle-hd-png.png",
            },
            description
        },
        json
    });
}