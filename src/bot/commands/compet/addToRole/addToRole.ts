import { Command } from "@/bot/structures/Command"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"

import { ApplicationCommandOptionType, EmbedBuilder} from "discord.js"

export default new Command ({
    name: 'add-to-role',
    description: 'Adiciona um Competiano a uma equipe',
    options: [
        {
            name: 'user',
            description: 'Nome do usuário',
            type: ApplicationCommandOptionType.User,
            required: true
        },

        {
            name: 'team',
            description: 'Equipe que competiano participará',
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    
    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true});

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const targetUserId = interaction.options.get('user')?.value;
        const roleId = interaction.options.get('team')?.role?.id;
        
        const targetUser = await interaction.guild?.members.fetch(`${targetUserId}`);
        const role = await interaction.guild?.roles.fetch(`${roleId}`);

        try {
            if (!targetUser || !role) {
                await interaction.editReply("Não foi possível executar o comando");
                return ;

            }
        } catch (error) {
            await interaction.editReply("Erro ao executar o comando");
            return ;
        }

        try {
            await targetUser.roles.add(role);
            const embed = new EmbedBuilder().setTitle("Equipe que foi adicionado");
            embed.addFields(
                {name: "Usuario", value: `${targetUser}`},
                {name: "Equipe", value: `${role.name}`}
            );

            await interaction.editReply({embeds: [embed]});
        } catch (error) {
            console.log(`Erro ao tentar adicionar a equipe ${error}`);
        }
    },
});