import { ChatInputApplicationCommandData } from "discord.js";
import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity";
import { Command } from "@/bot/structures/Command";
import { submitToAutentique } from "@/bot/utils/autentiqueAPI";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { createTalksPdf, formatarData } from "@/bot/utils/python";
import { readJsonFile } from "@/bot/utils/json";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { modal } from "@/bot/modals/compet/registerTalks/registerTalksModal";

function validateDriveLink(link: string): boolean {
  const regex =
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(\/view)?(\?usp=share_link)?$/;
  return regex.test(link);
}

const { name, description, options }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "registerTalksInput.json"
});

/**
 * @author Henrique de Paula Rodrigues
 * @description Esse comando é utilizado para gerar e registrar os certificados do talks no autentique
 * 
 */
export default new Command({
  name,
  description,
  //options,
  run: async ({ interaction }) => {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    const Mods = true

    if (Mods) {
      await interaction.showModal(modal)
    }
    else {

      const titulo = interaction.options.get("titulo")?.value as string;
      const assigner_name = interaction.options.get("nome-assinante")?.value as string;
      const assigner_mail = interaction.options.get("email-assinante")?.value as string;
      const link = interaction.options.get("link")?.value as string;
      const minutos_input = interaction.options.get("minutos")?.value as number;
      const timing: { horas: unknown; minutos: unknown } = {
        horas: Math.trunc(minutos_input / 60),
        minutos: minutos_input % 60,
      };
      const { horas, minutos } = {
        horas: timing.horas as string,
        minutos: timing.minutos as string,
      };

      if (!titulo) {
        return await interaction.reply({
          content: "Você precisa informar o titulo do evento!",
          ephemeral: true,
        });
      }

      try {
        const registration = await getCompetTalksRegistration(titulo);
        const listaNomes = registration.map(
          (registration) => registration.nome
        );
        const numPages = listaNomes.length;
        const data = new Date(registration[0].createTime);
        const compet_talks = true;
        const compbio = false;
        // Caso um link seja passado como parâmetro então a operação é apenas de cadastro de um certificado já existente e já autenticado,
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
            data,
            compbio,
            compet_talks,
            link,
            listaNomes,
            titulo,
          };
          const url = "http://localhost:4444/certificados/";
          const response = await fetch(url, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (response.status >= 200 && response.status < 300) {
            // TODO: enviar email para a lista de participantes informando que o certificado está disponivel
            return await interaction.reply({
              content: "Certificados registrados com sucesso!",
              ephemeral: true,
            });
          }
          const responseError: { code: number; message: string } =
            await response.json();

          return await interaction.reply({
            content: `Erro ${responseError.code}: ${responseError.message}`,
            ephemeral: true,
          });
        }

        /* Essa parte do código é responsável por gerar o pdf e enviar para o autentique,
        * no caso de um link não ter sido fornecido diretamente no input do comando
        */
        try {
          await interaction.reply({ content: "boa", ephemeral: true });
          const filePath = await createTalksPdf({ titulo, data: formatarData(data), listaNomes, horas, minutos });

          console.log("Caminho: " + filePath)

          await new Promise((resolve) => setTimeout(resolve, 5000));

          await submitToAutentique({
            numPages,
            titulo,
            filePath,
            signer: { name: assigner_name, email: assigner_mail },
          });

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
  },
});
