import { EmbedBuilder, EmbedData } from "discord.js";
import { readJsonFile, readJsonFileRequest } from "../json";

export interface makeEmbedRequest {
    data?: EmbedData,
    json?: readJsonFileRequest
}

export function makeEmbed({ data, json }: makeEmbedRequest) {

    if(json) {
        return new EmbedBuilder({...readJsonFile(json), data})
    }

    return new EmbedBuilder(data)
}