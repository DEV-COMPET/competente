import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

interface GenericButton {
    customId: string,
    label: string,
    style?: ButtonStyle,
    custom_id?: string
}

// Função genérica para criar botões
function makeButton(buttonData: GenericButton, style: ButtonStyle): ButtonBuilder {
    return new ButtonBuilder(buttonData).setStyle(style);
}

// Função para criar botões de sucesso
export function makeSuccessButton(buttonData: GenericButton): ButtonBuilder {
    return makeButton(buttonData, ButtonStyle.Success);
}

// Função para criar botões de cancelamento
export function makeCancelButton(buttonData: GenericButton): ButtonBuilder {
    return makeButton(buttonData, ButtonStyle.Secondary);
}

// Função para criar botões de perigo
export function makeDangerButton(buttonData: GenericButton): ButtonBuilder {
    return makeButton(buttonData, ButtonStyle.Danger);
}

// Função para criar botões de redirecionamento (link)
export function makeRedirectLinkButton(buttonData: GenericButton): ButtonBuilder {
    return makeButton(buttonData, ButtonStyle.Link);
}

// Função para criar linhas de ação com botões
export async function makeButtonComponent(button: ButtonBuilder): Promise<ActionRowBuilder<ButtonBuilder>> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}