import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
//AUTENTIQUE_TOKEN=b1d077069c083f43baa22fff6d9ced1e40c8978248f8e39b27ad9d2e7334ae03

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


