import {ChatInputApplicationCommandData, ComponentType} from "discord.js";
import selectEventNameMenuData from "../../../selectMenus/certificadosTalks/talksNameCertificateMenuData.json";

import {
    makeStringSelectMenu,
    makeStringSelectMenuComponent,
} from "@/bot/utils/modal/makeSelectMenu";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import {Command} from "@/bot/structures/Command";
import { getAllEventNames } from "@/bot/utils/googleAPI/getAllEventNames";
import {readJsonFile} from "@/bot/utils/json";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { checkIfAdminRole } from "@/bot/utils/embed/checkRoles";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "certificadosTalksInput.json"
});

/**
 * @author Pedro Vitor Melo Bitencourt
 * @description Comando que obtém informações de um talks selecionado por um select menu
 */
export default new Command({
    name,
    description,

    run: async ({ interaction }) => {
        try {
            await handleInteraction(interaction);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
        }
    },
});

async function handleInteraction(interaction: ExtendedInteraction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.replied) {
        console.log("A interação já foi respondida.");
        return;
    }

    const isNotAdmin = await checkIfNotAdmin(interaction);
    if (isNotAdmin.isRight())
        return isNotAdmin.value.response;

    const isAdminRole = await checkIfAdminRole(interaction);
    if (!isAdminRole) {
        return editErrorReply({
            interaction,
            error: new Error("Você não possui o cargo necessário: Administração."),
            title: "Você não possui o cargo necessário: Administração.",
        });
    }

    const getAllEventNamesResponse = await getAllEventNames({ interaction });

    if (getAllEventNamesResponse.isLeft()) {
        return await editErrorReply({
            error: getAllEventNamesResponse.value.error,
            interaction,
            title: getAllEventNamesResponse.value.error.message,
        });
    }

    const { customId, minMax } = selectEventNameMenuData;

    // Ordem decrescente de acordo com a data
    getAllEventNamesResponse.value.events.sort((a, b) => b.date.getTime() - a.date.getTime());
    const first25EventNames = getAllEventNamesResponse.value.events.slice(0, 25);

    const listEventNamesMenu = makeStringSelectMenu({
        customId: customId,
        type: ComponentType.StringSelect,
        options: first25EventNames.map((event) => ({
            label: String(event.name),
            value: String(event.name),
        })),
        maxValues: minMax.max,
        minValues: minMax.min,
    });

    await interaction.editReply({
        content: `Escolha um Talks`,
        components: [await makeStringSelectMenuComponent(listEventNamesMenu)],
    });
}