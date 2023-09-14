import {
  TextInputComponentData,
  ModalComponentData,
  EmbedBuilder,
} from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { createTalksPdf, formatarData } from "@/bot/utils/python";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity";
import { env } from "@/env";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";

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

interface InputFieldsRequest {
  titulo: string,
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
}

const modal = makeModal(inputFields, modalBuilderRequest);

interface createCertificatesInDatabaseRequest {
  body: CertificatesType
  interaction: ExtendedModalInteraction
}

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

interface ITalksPropsExtended {
  titulo: string,
  listaNomes: string[]
  horas?: string,
  minutos?: string
  data: Date
}

interface createCertificatesLocallyRequest {
  interaction: ExtendedModalInteraction
  input: ITalksPropsExtended
}

/* Essa parte do código é responsável por gerar o pdf e enviar para o autentique,
* no caso de um link não ter sido fornecido diretamente no input do comando
*/
async function createCertificatesLocally({ input, interaction }: createCertificatesLocallyRequest) {

  const { data, listaNomes, titulo, horas, minutos } = input

  try {

    await interaction.reply({ content: "boa", ephemeral: true });

    const filePath = await createTalksPdf({ titulo: titulo, data: formatarData(data), listaNomes, horas, minutos });

    console.log(filePath)

    await new Promise((resolve) => setTimeout(resolve, 5000));

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

    if (interaction.channel === null) throw "Channel is not cached";

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    const { horas, minutos, titulo, /*email_assinante,*/ link, /*nome_assinante*/ } = extractInputData({ interaction, inputFields })

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

      return createCertificatesLocally({
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
