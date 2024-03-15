import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { extractInputData } from "./utils/extractInputData";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";

import { inserirInfoSheets } from "@/bot/utils/googleAPI/insertCompetianoInfo";
import { validateInputData } from "./utils/validateInputData";

const { inputFields, modalBuilderRequest } : {
      inputFields: TextInputComponentData[],
      modalBuilderRequest: ModalComponentData,
} = readJsonFile({ dirname: __dirname, partialPath: 'inserirInfoData.json'});

const inserirInfoModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
      customId: 'inserir-info',

      run: async ({ interaction }) => {
            if (interaction.channel === null)
                  throw "Channel is not cached";

            await interaction.deferReply({ ephemeral: true });

            const isNotAdmin = await checkIfNotAdmin(interaction);
            if (isNotAdmin.isRight())
                  return isNotAdmin.value.response;

            
            const inputData = extractInputData({ inputFields, interaction });
            const validateInputDataResponse = validateInputData(inputData);
            if (validateInputDataResponse.isLeft()) {
                  return await interaction.editReply({
                        embeds: [
                              makeErrorEmbed({
                                    title: "Alguns dados foram passados fora de formato",
                                    error: {code: 401, message: validateInputDataResponse.value.error.message},
                                    interaction,
                              })
                        ]
                  })
            }

            await interaction.editReply({
                  embeds: [
                        makeSuccessEmbed({
                              title: "Os dados passados serão inseridos na planilha",
                              interaction
                        })
                  ]
            })

            const inserindoDados = await inserirInfoSheets(validateInputDataResponse.value.inputData);

            if (inserindoDados.isLeft()) {
                  return await interaction.editReply({
                        embeds: [
                              makeErrorEmbed({
                                    title: "Erro ao inserir os dados",
                                    error: {code: 500, message: inserindoDados.value.error.message},
                                    interaction,
                              })
                        ]
                  })
            }

            const { nome, telefone, email, instagram, linkedin } = inserindoDados.value.dadosInseridos;
            return await editSucessReply({
                  interaction, title: "Dados inseridos com sucesso",
                  fields: [
                        {
                              name: 'Nome',
                              value: nome,
                              inline: false
                        },
                        {
                              name: 'Telefone',
                              value: telefone,
                              inline: false
                        },
                        {
                              name: 'Email',
                              value: email,
                              inline: false
                        },
                        {
                              name: 'Instagram',
                              value: instagram || "Nenhum instagram informado",
                              inline: false
                        },
                        {
                              name: 'Linkedin',
                              value: linkedin || "Nenhum linkedin informado",
                              inline: false
                        }
                  ]
            })
      }
})

export { inserirInfoModal }