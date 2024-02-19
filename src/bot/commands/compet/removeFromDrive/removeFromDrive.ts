import { client } from "@/bot";
import { Command } from "@/bot/structures/Command"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { 
    ActionRowBuilder, 
    Events,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder, 
    TextInputStyle 
} from "discord.js";

import { removeFromDrive } from './utils/remove'
 /**  
  * @author Arthur dos Santos Oliveira
  * @description Esse comando é utilizado quando se remove o acesso de um ex-competiano do Google Drive da equipe
  * 
 */
export default new Command ({
    name: 'remove-from-drive',
    description: 'Remove acesso do drive de ex-competiano',
    run: async ({ interaction }) => {

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const modal = new ModalBuilder()
            .setCustomId('infoEmail')
            .setTitle("Email no drive");

        const emailInput = new TextInputBuilder()
            .setCustomId('email')
            .setLabel("Informe o email a ser removido:")
            .setPlaceholder("endereco@gmail.com")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(emailInput);

        modal.addComponents(firstActionRow);

        let response, email;
        await interaction.showModal(modal);

        client.on(Events.InteractionCreate, interaction => {
            if (!interaction.isModalSubmit()) 
                return ;
            
            email = interaction.fields.getTextInputValue('email');
            response = removeFromDrive(email);
        });
    }
})