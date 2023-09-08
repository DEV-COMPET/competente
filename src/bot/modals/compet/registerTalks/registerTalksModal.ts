import {
  TextInputComponentData,
  ModalComponentData,
} from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeNotAdminEmbed } from "@/bot/utils/embed/makeNotAdminEmbed";
import { createTalksPdf, formatarData } from "@/bot/utils/python";
import { submitToAutentique } from "@/bot/utils/autentiqueAPI";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity";
import { env } from "@/env";

const { inputFields, modalBuilderRequest }: {
  inputFields: TextInputComponentData[];
  modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'registerTalksModalData.json' });

const modal = makeModal(inputFields, modalBuilderRequest);

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

export default new Modal({
  customId: "registertalks",

  run: async ({ interaction }) => {

    if (interaction.channel === null) throw "Channel is not cached";

    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");

    if (!isADM)
      return makeNotAdminEmbed(interaction)

    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));
    const { email_assinante, link, minutos_totais, nome_assinante, titulo }: InputFieldsRequest = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });

    const minutos_input = minutos_totais as number;
    const timing: { horas: unknown; minutos: unknown } = {
      horas: Math.trunc(minutos_input / 60),
      minutos: minutos_input % 60,
    };
    const { horas, minutos } = {
      horas: timing.horas as string,
      minutos: timing.minutos as string,
    };

    try {

      const registration = await getCompetTalksRegistration(titulo);

      const listaNomes = registration.map(
        (registration) => registration.nome
      );

      //const numPages = listaNomes.length;
      const data = new Date(registration[0].createTime);

      if (link) {
        if (!validateDriveLink(link)) {
          await interaction.reply({
            content:
              "Link inválido, você precisa informar um link do google drive válido pra que possamos cadastra-lo na nossa base de dados!",
            ephemeral: true,
          });
          return;
        }

        const body: CertificatesType = {
          data, listaNomes, titulo, link,
          compbio: true,
          compet_talks: true,
        };

        const url = `${env.HOST}certificados/`

        const options = {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }

        const response = await fetch(url, options);

        if (response.status >= 200 && response.status < 300) {
          // TODO: enviar email para a lista de participantes informando que o certificado está disponivel
          return await interaction.reply({
            content: "Certificados registrados com sucesso!",
            ephemeral: true,
          });
        }
        const { code, message }: { code: number; message: string } = await response.json();

        return await interaction.reply({
          content: `Erro ${code}: ${message}`,
          ephemeral: true,
        });
      }

      /* Essa parte do código é responsável por gerar o pdf e enviar para o autentique,
      * no caso de um link não ter sido fornecido diretamente no input do comando
      */
      try {

        await interaction.reply({ content: "boa", ephemeral: true });

        const filePath = await createTalksPdf({ titulo: titulo, data: formatarData(data), listaNomes, horas, minutos });

        console.log(filePath)

        await new Promise((resolve) => setTimeout(resolve, 5000));

        // await submitToAutentique({
        //   numPages,
        //   titulo: titulo as string,
        //   filePath,
        //   signer: { name: nome_assinante, email: email_assinante },
        // });

        return;
      } catch (error: any) {
        console.error(error);
        return await interaction.reply({
          content: error.message,
          ephemeral: true,
        });
      }
    } catch (error: any) {
      return await interaction.reply({ content: error.message, ephemeral: true });
    }

  }
});

export { modal };
