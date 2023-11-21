import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./kickMemberData.json"

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js"

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
        const targetUser = await interaction.guild?.members.fetch(`${targetUserId}`);

        try {
            if (!targetUser) {
                await interaction.editReply("Não foi possível encontrar o usuario no servidor ");
                    return;
                }
        
                if (targetUser.id === interaction.guild?.ownerId) {
                await interaction.editReply("Você não pode *expulsar* o dono do servidor!");
                    return;
                }
        } catch (error) {
            await interaction.editReply("Erro ao executar o comando");
            return ;
        }


        

        try {
            await targetUser.kick();
            const embed = new EmbedBuilder().setTitle(`Remoção de ${targetUser.displayName}`);
            embed.addFields(
                {name: "Usuário: ", value: `${targetUser}`},
                {name: "Motivo: ", value: `${reason}`}
            );
            await interaction.editReply({embeds: [embed]});

        } catch (error) {
            const embed = new EmbedBuilder().setTitle(`Remoção de ${targetUser.displayName}`);
            embed.addFields(
                {name: "Erro: ", value: `Erro ao kickar ${targetUser}`},
            );
            await interaction.editReply({ embeds: [embed] });
            console.log(`Erro ao tentar kickar usuario ${error}`);
        }

    },

});