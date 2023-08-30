import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} from "discord.js";
import { Member } from "../../typings/Member";
import { Modal } from "../../structures/Modals";
import { env } from "@/env";

const modal = new ModalBuilder()
  .setTitle("Adicione o mais novo membro do compet!")
  .setCustomId("addmember");
const nameInput = new TextInputBuilder()
  .setCustomId("membernameinput")
  .setLabel("Qual o nome do novo membro?")
  .setPlaceholder("Sandro Renato Dias")
  .setStyle(TextInputStyle.Short)
  .setMinLength(3)
  .setMaxLength(161)
  .setRequired(true);
const emailInput = new TextInputBuilder()
  .setCustomId("memberemailinput")
  .setLabel("Qual o email do novo membro?")
  .setPlaceholder("Andrejogadorcarodacruz@gmail.com")
  .setStyle(TextInputStyle.Short)
  .setRequired(true);

const linkedinInput = new TextInputBuilder()
  .setCustomId("memberlinkedininput")
  .setLabel("Qual o linkedin do novo membro?")
  .setPlaceholder("https://www.linkedin.com/in/NataliaBatista")
  .setStyle(TextInputStyle.Short)
  .setRequired(false);
const imageUrlInput = new TextInputBuilder()
  .setCustomId("memberimageUrlinput")
  .setLabel("O link da foto do novo membro")
  .setPlaceholder("https://i.ibb.co/j4PDk7n/btg3.jpg")
  .setStyle(TextInputStyle.Short)
  .setRequired(false);
const firstInput =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    nameInput
  );
const secondInput =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    emailInput
  );
const thirdInput =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    linkedinInput
  );
const fourthInput =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    imageUrlInput
  );

modal.addComponents(firstInput, secondInput, thirdInput, fourthInput);
export default new Modal({
  customId: "addmember",
  run: async ({ interaction }) => {
    const createMemberUrl =
      env.ENVIRONMENT === "development" ? "http://localhost:4444/competianos/" : `${env.HOST}/competianos` || "http://localhost:4444/competianos/";
    const nome = interaction.fields.getTextInputValue(
      nameInput.data.custom_id || ""
    );
    const email = interaction.fields.getTextInputValue(
      emailInput.data.custom_id || ""
    );
    const linkedin = interaction.fields.getTextInputValue(
      linkedinInput.data.custom_id || ""
    );
    const url_imagem = interaction.fields.getTextInputValue(
      imageUrlInput.data.custom_id || ""
    );
    const data_inicio = new Date().toISOString();

    const requestOptions = {
      method: "post",
      body: JSON.stringify({ nome, email, linkedin, url_imagem, data_inicio }),
      headers: { "Content-Type": "application/json" },
    };


    const response = await fetch(createMemberUrl, requestOptions);


    console.log(response.status)

    if (interaction.channel === null) throw "Channel is not cached";
    if (response.status >= 200 && response.status < 300) {
      const data: Member = await response.json();
      const embed = new EmbedBuilder()
        .setColor(0x19dd39)
        .setTitle("Usuário criado")
        .setAuthor({
          name: interaction.user.username || "abc",
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .setDescription(
          "Abaixo você encontra as informações sobre o usuário criado"
        )
        .setThumbnail(
          "https://www.pngfind.com/pngs/m/0-226_image-checkmark-green-check-mark-circle-hd-png.png"
        )
        .addFields(
          { name: "Nome", value: data.nome, inline: false },
          { name: "Data de início", value: data.data_inicio, inline: false },
          {
            name: "Linkedin",
            value: data.linkedin || " Nenhum linkedin informado",
            inline: false,
          },
          { name: "Email", value: data.email, inline: false }
        );
      url_imagem
        ? embed.setImage(url_imagem)
        : embed.setImage(
            "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
          );
      embed.setTimestamp();
      return await interaction.reply({
        content: "Seu envio foi realizado com sucesso!",
        ephemeral: true,
        embeds: [embed],
      });
    }
      const data: { code: number; message: string } = await response.json();
      const embed = new EmbedBuilder()
        .setColor(0xf56565)
        .setTitle("Não foi possível criar o novo membro")
        .setAuthor({
          name: interaction.user.username.replaceAll("_", " ") || "abc",
          iconURL: interaction.user.avatarURL() || undefined,
        })
        .setDescription("Abaixo você encontra as informações sobre o erro")
        .setThumbnail(
          "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
        )
        .addFields(
          {
            name: "Código do erro",
            value: data.code.toString(),
            inline: false,
          },
          { name: "Mensagem do erro", value: data.message, inline: false }
        );
      return await interaction.reply({
        content: "Não foi possível concluir o cadastro",
        ephemeral: true,
        embeds: [embed],
      });
  },
});
export { modal };
