import {
  TextInputComponentData,
  ModalComponentData,
  EmbedBuilder,
} from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { createTalksPdf } from "@/bot/utils/python";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { env } from "@/env";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { ExtractInputDataRequest, ExtractInputDataResponse, InputFieldsRequest, createCertificatesInDatabaseRequest, createCertificatesLocalAndDriveRequest } from "./interfaces";

// import { submitToAutentique } from "@/bot/utils/autentiqueAPI";

const { inputFields, modalBuilderRequest }: {
  inputFields: TextInputComponentData[];
  modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'registerTalksModalData.json' });

function validateDriveLink(link: string): boolean {
  const regex =
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(\/view)?(\?usp=share_link)?$/;
  return regex.test(link);
}

/**
 * @author Henrique de Paula Rodrigues
 * @description Cadastra certificados no banco de dados
 */
async function createCertificatesInDatabase({ body, interaction }: createCertificatesInDatabaseRequest) {
  if (!validateDriveLink(body.link)) {
    return await interaction.reply({
      content: "Link inválido, você precisa informar um link do google drive válido pra que possamos cadastra-lo na nossa base de dados!",
      ephemeral: true,
    });
  }

  // const body: CertificatesType = {
  //   data, listaNomes, titulo, link,
  //   compbio: true,
  //   compet_talks: true,
  // };
  const url = `${env.HOST}certificados/`
  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }

  const response = await fetch(url, options);
  if (!(200 <= response.status && response.status < 300)) {
    // TODO: enviar email para a lista de participantes informando que o certificado está disponivel
    const { code, message }: { code: number; message: string } = await response.json();
    return await interaction.reply({
      content: `Erro ${code}: ${message}`,
      ephemeral: true,
    });
  }

  return await interaction.reply({
    content: "Certificados registrados com sucesso!",
    ephemeral: true,
  });
}

const modal = makeModal(inputFields, modalBuilderRequest);

/**
 * @author Henrique de Paula Rodrigues, Pedro Augusto de Portilho Ronzani
 * @description Gera o PDF dos certificados, salva-os no Google Drive e Envia-os para o Autentique.
 */
async function createCertificatesLocalAndDrive({ input, interaction }: createCertificatesLocalAndDriveRequest) {

  const { data, listaNomes, titulo, horas, minutos } = input

  try {

    await interaction.reply({ content: "boa", ephemeral: true });

    const filePath = await createTalksPdf({ titulo: titulo, data: formatarData(data), listaNomes, horas, minutos });

    if (filePath.isLeft())
      throw filePath.value.error

    console.log(`Certificados Locais: ${filePath.value.path_to_certificates}`)

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const updateToFolderResponse = await uploadToFolder(filePath.value.path_to_certificates)

    if (updateToFolderResponse.isLeft())
      throw updateToFolderResponse.value.error

    console.log(`Certificados no Google Drive: ${env.GOOGLE_DRIVE_FOLDER_ID}`)

    /*
        //const numPages = listaNomes.length;
    
    
        // await submitToAutentique({
        //   numPages,
        //   titulo: titulo as string,
        //   filePath,
        //   signer: { name: nome_assinante, email: email_assinante },
        // });
    */
    return;

  } catch (error: any) {
    console.error(error);
    return await interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
}

function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
  const customIds = inputFields.map((field) => field.customId || "");
  const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
  const { /*email_assinante,*/ link, minutos_totais, /*nome_assinante,*/ titulo }: InputFieldsRequest = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });

  const minutos_input = minutos_totais as number;
  const timing: { horas: unknown; minutos: unknown } = {
    horas: Math.trunc(minutos_input / 60),
    minutos: minutos_input % 60,
  };
  const { horas, minutos } = {
    horas: timing.horas as string,
    minutos: timing.minutos as string,
  };

  return { horas, link, minutos, titulo }
}

export default new Modal({
  customId: "registertalks",

  run: async ({ interaction }) => {

    if (interaction.channel === null)
      throw "Channel is not cached";

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    const { horas, minutos, titulo, link, /*nome_assinante,email_assinante*/ } = extractInputData({ interaction, inputFields })

    try {

      const registration = await getCompetTalksRegistration(titulo);
      if (registration.isLeft()) {
        const embed = new EmbedBuilder()
          .setColor(0xf56565)
          .setTitle("Não foi possível completar essa ação!")
          .setDescription(registration.value.error.message)
          .setThumbnail(
            "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
          )
          .addFields(
            {
              name: "Código do erro",
              value: "401",
              inline: false
            },
            {
              name: "Mensagem do erro",
              value: registration.value.error.message,
              inline: false,
            }
          );

        return await interaction.reply({
          content: "Não foi possível executar este comando",
          ephemeral: true,
          embeds: [embed],
        });
      }

      const listaNomes = registration.value.eventRegistrations.map((registration) => registration.nome);
      const data = new Date(registration.value.eventRegistrations[0].createTime);

      if (link) return createCertificatesInDatabase({
        interaction,
        body: {
          compbio: true,
          compet_talks: true,
          data, link, listaNomes, titulo
        }
      })

      return createCertificatesLocalAndDrive({
        interaction,
        input: {
          data, listaNomes, titulo, horas, minutos
        }
      })

    } catch (error: any) {
      return await interaction.reply({
        content: error.message,
        ephemeral: true
      });
    }

  }
});

export { modal };
