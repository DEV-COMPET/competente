import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./kickMemberData.json"

import { ApplicationCommandOptionType } from "discord.js"

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

        const targetUserId = interaction.options.get('target-user')?.value;
        const reason = interaction.options.get('reason')?.value || 'Nenhuma justificativa foi fornecida';

        await interaction.deferReply();

        const targetUser = await interaction.guild?.members.fetch(`${targetUserId}`);

        if (!targetUser) {
        await interaction.editReply("Não foi possível encontrar o usuario no servidor ");
            return;
        }

        if (targetUser.id === interaction.guild?.ownerId) {
        await interaction.editReply("Você não pode *expulsar* o dono do servidor!");
            return;
        }

        const targetUserRolePosition = targetUser.guild.roles.highest.position;
        const requestUserRolePosition = interaction.guild?.members.me?.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Você não tem autorização para explusar este usuário!");
            return ;
        }

        try {
            await targetUser.kick();
            await interaction.editReply(
                `usuário: ${targetUser} foi expulso
                Reason: ${reason}`
            );

        } catch (error) {
            console.log(`Erro ao tentar kickar usuario ${error}`);
        }

    },

});