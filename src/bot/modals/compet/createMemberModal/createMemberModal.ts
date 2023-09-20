import {
  TextInputComponentData,
  ModalComponentData,
  InteractionResponse,
} from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { env } from "@/env";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeEmbed } from "@/bot/utils/embed/makeEmbed";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { Member } from "@/bot/typings/Member";

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

    const { createMemberUrl, requestOptions } = extractInputData(interaction)

    const response = await fetch(createMemberUrl, requestOptions);

    if (!(response.status >= 200 && response.status < 300))
      return await errorReply(interaction, response)

    return await sucessReply(interaction, response)
  },
});

interface ExtractInputDataResponse {
  createMemberUrl: string
  requestOptions: {
    method: string;
    body: string;
    headers: {
      "Content-Type": string;
    };
  }
}

function extractInputData(interaction: ExtendedModalInteraction): ExtractInputDataResponse {

  const customIds = inputFields.map((field) => field.customId || "");
  const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
  const combinedData: CompetianoType = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });
  const requestOptions = {
    method: "post",
    body: JSON.stringify(combinedData),
    headers: { "Content-Type": "application/json" },
  };

  const createMemberUrl = env.ENVIRONMENT === "development" ? "http://localhost:4444/competianos" : `${env.HOST}/competianos` || "http://localhost:4444/competianos/";
  
  return { createMemberUrl, requestOptions }
}


async function sucessReply(interaction: ExtendedModalInteraction, response: Response): Promise<InteractionResponse<boolean>> {

  const { nome, data_inicio, linkedin, email }: Member = await response.json();
  
  const embed = makeEmbed({
    data: {
      author: {
        name: interaction.user.username || "abc",
        iconURL: interaction.user.avatarURL() || undefined,
      },
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
    },
    json: {
      dirname: __dirname,
      partialPath: "createMemberSuccessEmbed.json"
    }
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









