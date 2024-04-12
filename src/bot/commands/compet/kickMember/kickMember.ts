import { env } from "@/env";
import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./kickMemberData.json"

import { ApplicationCommandOptionType, Client, ComponentType, EmbedBuilder, Events, GatewayIntentBits } from "discord.js"
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

import { customId, minMax } from "@/bot/selectMenus/discord/removeMemberFromDiscord.json";

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
    console.log(typeof(guildMembers));

    for (const memberId of guildMembers) {
        const member = memberId[1].user;
        extractedMembers.push({ id: member.id, username: member.username, globalName: member.globalName });
    }
    console.log(extractedMembers);

    if(extractedMembers.length > 0) {
        const nameMenu = makeStringSelectMenu({
            customId,
            type: ComponentType.StringSelect,
            options: extractedMembers.map(member => ({
            label: member.globalName!,
            value: member.id.toString(),
            })),
            maxValues: minMax.max,
            minValues: minMax.min,
        });

        await interaction.editReply({
        content: 'Selecione o membro a ser removido',
        components: [await makeStringSelectMenuComponent(nameMenu)]
        });
    }

//console.log(extractedMembers);
    // const targetUserId = interaction.options.get('target-user')?.value;
    // const reason = interaction.options.get('reason')?.value || 'Nenhuma justificativa foi fornecida';
    // const targetUser = await interaction.guild?.members.fetch(`${targetUserId}`);
    // console.log("oi2");

    // try {
    //     if (!targetUser) {
    //         await interaction.editReply("Não foi possível encontrar o usuario no servidor ");
    //             return;
    //         }
    
    //         if (targetUser.id === interaction.guild?.ownerId) {
    //         await interaction.editReply("Você não pode *expulsar* o dono do servidor!");
    //             return;
    //         }
    // } catch (error) {
    //     await interaction.editReply("Erro ao executar o comando");
    //     return ;
    // }

    // try {
    //     await targetUser.kick();
    //     const embed = new EmbedBuilder().setTitle(`Remoção de ${targetUser.displayName}`);
    //     embed.addFields(
    //         {name: "Usuário: ", value: `${targetUser}`},
    //         {name: "Motivo: ", value: `${reason}`}
    //     );
    //     await interaction.editReply({embeds: [embed]});

    // } catch (error) {
    //     const embed = new EmbedBuilder().setTitle(`Remoção de ${targetUser.displayName}`);
    //     embed.addFields(
    //         {name: "Erro: ", value: `Erro ao kickar ${targetUser}`},
    //     );
    //     await interaction.editReply({ embeds: [embed] });
    //     console.log(`Erro ao tentar kickar usuario ${error}`);
    // }
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