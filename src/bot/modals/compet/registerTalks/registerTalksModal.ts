import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { createTalksPdf } from "@/bot/utils/python";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { env } from "@/env";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";

// import { submitToAutentique } from "@/bot/utils/autentiqueAPI";

import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity"
import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { PythonShellError } from "python-shell";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";

interface InputFieldsRequest {
  titulo: string,
  data_new: string
  email_assinante: string,
  nome_assinante: string,
  minutos_totais: number
  link: string
}

interface ExtractInputDataRequest {
  interaction: ExtendedModalInteraction,
  inputFields: TextInputComponentData[]
}

interface ExtractInputDataResponse {
  horas: string,
  minutos: string,
  link?: string,
  email_assinante?: string
  nome_assinante?: string
  titulo: string
  data_new: string
}

interface createCertificatesInDatabaseRequest {
  body: CertificatesType
  interaction: ExtendedModalInteraction
}

interface ITalksPropsExtended {
  titulo: string,
  listaNomes: string[]
  horas?: string,
  minutos?: string
  data: Date
}

interface createCertificatesLocalAndDriveRequest {
  interaction: ExtendedModalInteraction
  input: ITalksPropsExtended
}




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

  const filePath = await createTalksPdf({ titulo: titulo, data: formatarData(data), listaNomes, horas, minutos });

  if (filePath.isLeft()) {
    console.error(filePath.value.error.message)
    if (filePath.value.error instanceof PythonShellError)
      return await interaction.editReply(`Erro do Python não identificado`)

    if (filePath.value.error instanceof PythonVenvNotActivatedError)
      return await interaction.editReply(`Ambiente virtual do Pythonn não ativado.`)

    return await interaction.editReply(`Erro não previsto. Verifique o log para mais informações.`)
  }

  const updateToFolderResponse = await uploadToFolder(filePath.value.path_to_certificates)

  if (updateToFolderResponse.isLeft())
    return await interaction.editReply(`Erro durante a geração de certificados (Python provavelmente)`)

  /*
      //const numPages = listaNomes.length;
  
      // await submitToAutentique({
      //   numPages,
      //   titulo: titulo as string,
      //   filePath,
      //   signer: { name: nome_assinante, email: email_assinante },
      // });
  */
  return await interaction.editReply({
    embeds: [
      makeSuccessEmbed({
        title: "Certificados de Presença gerados com sucesso!",
        fields: [
          {
            name: "Nome do Evento",
            value: `${titulo}`
          },
          {
            name: "Link do Google Drive",
            value: `https://drive.google.com/drive/folders/${env.GOOGLE_DRIVE_FOLDER_ID}`
          }
        ],
        interaction
      })
    ]
  })
}

function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
  const customIds = inputFields.map((field) => field.customId || "");
  const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
  const { /*email_assinante,*/ link, minutos_totais, /*nome_assinante,*/ titulo, data_new }: InputFieldsRequest = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });

  const minutos_input = minutos_totais as number;
  const timing: { horas: unknown; minutos: unknown } = {
    horas: Math.trunc(minutos_input / 60),
    minutos: minutos_input % 60,
  };
  const { horas, minutos } = {
    horas: timing.horas as string,
    minutos: timing.minutos as string,
  };

  return { horas, link, minutos, titulo, data_new }
}

export default new Modal({
  customId: "registertalks",

  run: async ({ interaction }) => {

    if (interaction.channel === null)
      throw "Channel is not cached";

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    const { horas, minutos, titulo, link, data_new, /*nome_assinante,email_assinante*/ } = extractInputData({ interaction, inputFields })

    try {

      await interaction.deferReply({ ephemeral: true })

      const registration = await getCompetTalksRegistration(titulo);
      if (registration.isLeft()) {
        if (registration.isLeft())
          return await interaction.editReply({
            embeds: [
              makeErrorEmbed({
                error: { code: 401, message: registration.value.error.message },
                interaction, title: "Titulo de Talks Invalido!"
              })
            ]
          })
      }

      const listaNomes = registration.value.eventRegistrations.map((registration) => registration.nome);
      // TODO: const data = new Date(registration.value.eventRegistrations[0].createTime);

      const parts = data_new.split("-"); // Split the string into parts
      const day = parseInt(parts[0], 10); // Parse day as an integer
      const month = parseInt(parts[1], 10) - 1; // Parse month as an integer (months are 0-indexed)
      const year = parseInt(parts[2], 10); // Parse year as an integer

      const data = new Date(year, month, day);

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
      await interaction.editReply({ content: "Erro" })
    }

  }
});

export { modal };
