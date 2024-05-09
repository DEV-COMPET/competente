import { env } from "@/env";
import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./kickMemberData.json"

import { ApplicationCommandOptionType, Client, ComponentType, EmbedBuilder, Events, GatewayIntentBits } from "discord.js"
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

import { customId, minMax } from "@/bot/selectMenus/discord/removeMemberFromDiscord.json";
import { handlingRemove } from "../removeFromCompet/utils/handleRemove";

export default new Command ({

    name, description,
    options: [
        {
            name: 'target-user',
            description: 'Usuário a ser expluso',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'reason',
            description: 'Motivo para a expulsão do usuaŕio',
            type: ApplicationCommandOptionType.String,
        }

    ],

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true })
    
        const isNotAdmin = await checkIfNotAdmin( interaction )
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        await handleRemoveFromDiscordInteraction(interaction);

    },

});

export async function handleRemoveFromDiscordInteraction(interaction: ExtendedInteraction) {
    const client = new Client({
        intents: [
            GatewayIntentBits.GuildMembers,  // MAKE SURE TO ADD THIS
        ],
    });

    await client.login(env.DISCORD_TOKEN);
    
    const guild = await client.guilds.fetch('1173025347466436712');
    const guildMembers = await guild.members.fetch();
    const extractedMembers = [];

    //console.log(guildMembers);
    //console.log(typeof(guildMembers));

    for (const memberId of guildMembers) {
        const member = memberId[1].user;
        extractedMembers.push({ id: member.id, username: member.username, globalName: member.globalName });
    }
    const filteredExtractedMembers = extractedMembers.filter(member => member.globalName !== null);
    //console.log(extractedMembers);


    if(extractedMembers.length > 0) {
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

        handlingRemove.push(interaction);

        await interaction.editReply({
        content: 'Selecione o membro a ser removido do Discord',
        components: [await makeStringSelectMenuComponent(nameMenu)]
        });
    }

//console.log(extractedMembers);
    
}

async function banUser(userId: string) {
    fetch(`https://discord.com/api/v9/guilds/${env.DISCORD_GUILD_ID}/bans/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bot ${env.DISCORD_TOKEN}` // Assuming you're using a bot token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to ban the user');
        }
        console.log('User banned successfully');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}