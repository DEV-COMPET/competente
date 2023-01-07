import { ActionRow, ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "../../structures/Command";
const modal = new ModalBuilder()
      .setTitle("Adicione o mais novo membro do compet!")
      .setCustomId("add_Member")
    const nameInput = new TextInputBuilder()
      .setCustomId("member_name_input")
      .setLabel("Qual o nome do novo membro?")
      .setPlaceholder("Sandro Renato Dias")
      .setStyle(TextInputStyle.Short)

    const emailInput = new TextInputBuilder()
      .setCustomId("member_email_input")
      .setLabel("Qual o email do novo membro?")
      .setPlaceholder("Andrejogadorcarodacruz@gmail.com")
      .setStyle(TextInputStyle.Short)

    const linkedinInput = new TextInputBuilder()
      .setCustomId("member_linkedin_input")
      .setLabel("Qual o linkedin do novo membro?")
      .setPlaceholder("https://www.linkedin.com/in/NataliaBatista")
      .setStyle(TextInputStyle.Short)

    const imageUrlInput = new TextInputBuilder()
      .setCustomId("member_imageUrl_input")
      .setLabel("O link da foto do novo membro")
      .setPlaceholder("https://i.ibb.co/j4PDk7n/btg3.jpg")
      .setStyle(TextInputStyle.Short)
    const firstInput = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput)
    const secondInput = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(emailInput)
    const thirdInput = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(linkedinInput)
    const fourthInput = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(imageUrlInput)
    
    modal.addComponents(
      firstInput,
      secondInput,
      thirdInput,
      fourthInput)
export default new Command({
  name: "create",
  description: "Esse comando adiciona um novo competiano ao compet",
  run: async ({ interaction ,client}) => {
    await interaction.showModal(modal)
  }
})