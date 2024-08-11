import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { extractInputData, ExtractInputDataResponse } from "./utils/extractInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { TextInputComponentData, ModalComponentData, Client, GatewayIntentBits, ComponentType } from "discord.js";

import { removeFromDrive } from "@/bot/utils/googleAPI/googleDrive";
import { validateInputData } from "./utils/validateInputData";
import { env } from "@/env";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

import { customId, minMax } from '../../../selectMenus/discord/removeMemberFromDiscord.json';
import { removeFromTrello } from "@/bot/selectMenus/discord/removeMemberFromDiscord";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";
import { cancelOption } from "@/bot/selectMenus/discord/selectMenuList";

const { inputFields, modalBuilderRequest}: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'removeFromDriveData.json'})

const removeFromDriveModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: 'remove-from-drive',

    run: async ({ interaction }) => {
        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true});

        const input_data = extractInputData({ interaction , inputFields });

        await handleRemoveFromDriveInteraction(interaction, input_data);
    }
});

export async function handleRemoveFromDriveInteraction(interaction: ExtendedModalInteraction | ExtendedStringSelectMenuInteraction, { emails }: ExtractInputDataResponse) {
    const validateInputDataResponse = await validateInputData({ emails });

    if (validateInputDataResponse.isLeft()) {
        return await editErrorReply({
            interaction,
            title: "Não é possível remover dados, emails passados invalido",
            error: validateInputDataResponse.value.error
        })
    }

    const emailsVerificado = validateInputDataResponse.value.inputData.emails;

    const removeFromDriveResponse = await removeFromDrive(emailsVerificado);
    if (removeFromDriveResponse.isLeft()) {
        await editErrorReply({
            interaction,
            title: "Alguns emails não foram removidos",
            error: removeFromDriveResponse.value.error
        });

        const filteredExtractedMembers = await getDiscordMembers();

        if(filteredExtractedMembers.length > 0) {
            const nameMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options: filteredExtractedMembers.map(member => ({
                label: member.globalName!,
                value: member.id.toString(),
                })),
                maxValues: minMax.max,
                minValues: minMax.min,
            });
    
            // handlingRemove.push(interaction);
    
            await interaction.editReply({
            content: 'Selecione o membro a ser removido do Discord',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
        }
        // sem membro no Discord, logo, vamos remover do Trello
        else
            await removeFromTrello(interaction);
    }
    else {
        await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: `Os seguintes emails foram removidos do Drive com sucesso:\n ${emailsVerificado}`,
                    interaction
                })
            ]
        });
        
        const filteredExtractedMembers = await getDiscordMembers();
    
        if(filteredExtractedMembers.length > 0) {
            const nameMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options: filteredExtractedMembers.map(member => ({
                label: member.globalName!,
                value: member.id.toString(),
                })),
                maxValues: minMax.max,
                minValues: minMax.min,
            });
    
            await interaction.editReply({
            content: 'Selecione o membro a ser removido do Discord',
            components: [await makeStringSelectMenuComponent(nameMenu)]
            });
        }
        else // sem membro no Discord, logo vamos remover do Trello diretamente
            await removeFromTrello(interaction);
    }
}

async function getDiscordMembers() {
    const client = new Client({
        intents: [
            GatewayIntentBits.GuildMembers,  // MAKE SURE TO ADD THIS
        ],
    });

    await client.login(env.DISCORD_TOKEN);
    
    const guild = await client.guilds.fetch(env.DISCORD_GUILD_ID);
    const guildMembers = await guild.members.fetch();
    const extractedMembers = [];

    for (const memberId of guildMembers) {
        const member = memberId[1].user;
        extractedMembers.push({ id: member.id, username: member.username, globalName: member.globalName });
    }
    const filteredExtractedMembers = extractedMembers.filter(member => member.globalName !== null);
    

    filteredExtractedMembers.push(cancelOption); // opção "Nenhum"

    return filteredExtractedMembers;
}

export { removeFromDriveModal, getDiscordMembers }