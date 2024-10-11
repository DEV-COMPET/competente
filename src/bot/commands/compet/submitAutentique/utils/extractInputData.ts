import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";

interface CollectDocumentInfoRequest {
    interaction: CommandInteraction;
    inputFields: string[];
}

export interface DocumentInfo {
    titulo: string;
    email: string;
    nome: string;
    filePath: string;
    numPages: number;
}

export function collectDocumentInfo({ interaction, inputFields }: CollectDocumentInfoRequest): DocumentInfo {
    const input_data = inputFields.map(i => {
        const option = interaction.options.get(i);

        if (option && option.value !== undefined) {
            if (option.type === ApplicationCommandOptionType.String) {
                return { [i]: option.value as string };
            } else if (option.type === ApplicationCommandOptionType.Integer) {
                return { [i]: option.value.toString() };
            }
        }

        // Retorna uma string vazia se a opção for undefined
        return { [i]: '' };
    });

    const { titulo, email, nome, filePath, numPagesStr } = Object.assign({}, ...input_data);

    return { 
        titulo: titulo?.trim() || '', 
        email: email?.trim() || '', 
        nome: nome?.trim() || '', 
        filePath: filePath?.trim() || '', 
        numPages: numPagesStr ? parseInt(numPagesStr.trim(), 10) : 0
    };
}


