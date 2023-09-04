import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  TextInputComponentData,
  ModalComponentData,
} from "discord.js";
import { Member } from "../../typings/Member";
import { Modal } from "../../structures/Modals";
import { env } from "@/env";
import * as fs from 'fs';
import * as path from "path";

function readJsonFile(name: string) {
  const filePath = path.join(__dirname, name);

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(jsonData);
    return jsonObject;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

function createMemberModal(inputFields: TextInputComponentData[], modalBuilderRequestData: ModalComponentData) {
  const modal = new ModalBuilder(modalBuilderRequestData)

  const inputComponents = inputFields.map((field) => {
    const inputBuilder = new TextInputBuilder(field)

    return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(inputBuilder);
  });

  modal.addComponents(...inputComponents);

  return modal;
}

const inputFields: TextInputComponentData[] = readJsonFile('createMemberInputFields.json').inputFields
const modalBuilderRequestData1: ModalComponentData = readJsonFile('modalBuilderRequest.json')

const modal = createMemberModal(inputFields, modalBuilderRequestData1);

export default new Modal({
  customId: "addmember",

  run: async ({ interaction }) => {

    if (interaction.channel === null) throw "Channel is not cached";

    const customIds = inputFields.map((field) => field.customId || "");

    const data_to_send = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
    const combinedData = Object.assign({}, ...data_to_send, { data_inicio: new Date().toISOString() });

    const requestOptions = {
      method: "post",
      body: JSON.stringify(combinedData),
      headers: { "Content-Type": "application/json" },
    };
    
    const createMemberUrl = env.ENVIRONMENT === "development" ? "http://localhost:4444/competianos/" : `${env.HOST}/competianos` || "http://localhost:4444/competianos/";
    const response = await fetch(createMemberUrl, requestOptions);

    if (response.status >= 200 && response.status < 300) {
      const data: Member = await response.json();

      const embedDataSucessJSON = readJsonFile("embedSucessCreateUser.json")

      const embed = new EmbedBuilder({
        author: {
          name: interaction.user.username || "abc",
          iconURL: interaction.user.avatarURL() || undefined,
        },
        fields: [
          { name: "Nome", value: data.nome, inline: false },
          { name: "Data de início", value: data.data_inicio, inline: false },
          {
            name: "Linkedin",
            value: data.linkedin || " Nenhum linkedin informado",
            inline: false,
          },
          { name: "Email", value: data.email, inline: false }
        ],
        ...embedDataSucessJSON
      })

      const url_imagem = interaction.fields.getTextInputValue("url_imagem")

      url_imagem ?
        embed.setImage(url_imagem) :
        embed.setImage("https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png");
      embed.setTimestamp(); // FIXME: desnecessário se passar nada?

      return await interaction.reply({
        content: "Seu envio foi realizado com sucesso!",
        ephemeral: true,
        embeds: [embed],
      });
    }

    const data: { code: number; message: string } = await response.json();

    const embedDataErrorJSON = readJsonFile("embedErrorCreateUser.json");

    const embed = new EmbedBuilder({
      author: {
        name: interaction.user.username.replaceAll("_", " ") || "abc",
        icon_url: interaction.user.avatarURL() || undefined,
      },
      fields: [
        {
          name: "Código do erro",
          value: data.code.toString(),
          inline: false,
        },
        {
          name: "Mensagem do erro",
          value: data.message,
          inline: false,
        },
      ],
      ...embedDataErrorJSON, // Merge properties from the JSON file
    })

    return await interaction.reply({
      content: "Não foi possível concluir o cadastro",
      ephemeral: true,
      embeds: [embed],
    });
  },
});

export { modal };
