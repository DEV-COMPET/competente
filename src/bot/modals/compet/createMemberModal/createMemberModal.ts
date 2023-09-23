import {
  TextInputComponentData,
  ModalComponentData,
  InteractionResponse,
} from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeEmbed } from "@/bot/utils/embed/makeEmbed";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { Member } from "@/bot/typings/Member";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { extractInputData } from "./utils/extractInputData";

const { inputFields, modalBuilderRequest }: {
  inputFields: TextInputComponentData[];
  modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'createMemberModalData.json' });

const createMemberModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
  customId: "addmember",

  run: async ({ interaction }) => {

    if (interaction.channel === null)
      throw "Channel is not cached";

    const { createMemberUrl, requestOptions } = extractInputData({ inputFields, interaction })

    const response = await fetch(createMemberUrl, requestOptions);

    if (!(response.status >= 200 && response.status < 300))
      return await errorReply(interaction, response)

    return await sucessReply(interaction, response)
  },
});

async function sucessReply(interaction: ExtendedModalInteraction, response: Response): Promise<InteractionResponse<boolean>> {

  const { nome, data_inicio, linkedin, email, url_imagem }: Member = await response.json();

  // const url_imagem = interaction.fields.getTextInputValue("url_imagem")

  const embed = makeSuccessEmbed({
    title: "Competiano criado com sucesso. Seja bem vindo!!",
    fields: [
      {
        name: "Nome",
        value: nome,
        inline: false
      },
      {
        name: "Data de início",
        value: data_inicio,
        inline: false
      },
      {
        name: "Linkedin",
        value: linkedin || " Nenhum linkedin informado",
        inline: false,
      },
      {
        name: "Email",
        value: email,
        inline: false
      }
    ],
    interaction,
    url_imagem: url_imagem ? url_imagem : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
  })



  return await interaction.reply({
    ephemeral: true,
    embeds: [embed],
  });

}

async function errorReply(interaction: ExtendedModalInteraction, response: Response): Promise<InteractionResponse<boolean>> {

  const { code, message }: { code: number; message: string } = await response.json();

  const embed = makeEmbed({
    data: {
      author: {
        name: interaction.user.username.replaceAll("_", " ") || "abc",
        iconURL: interaction.user.avatarURL() || undefined,
      },
      fields: [
        {
          name: "Código do erro",
          value: code.toString(),
          inline: false,
        },
        {
          name: "Mensagem do erro",
          value: message,
          inline: false,
        },
      ],
    }
  })


  return await interaction.reply({
    content: "Não foi possível concluir o cadastro",
    ephemeral: true,
    embeds: [embed],
  });
}

export { createMemberModal };