import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CertificatesType } from "../../../api/modules/certificados/entities/certificados.entity";
import { Command } from "../../structures/Command";
import { submitToAutentique } from "../../utils/autentiqueAPI";
import { getCompetTalksRegistration } from "../../utils/googleAPI/getCompetTalks";
import { createTalksPdf, formatarData } from "../../utils/python";

function validateDriveLink(link: string): boolean {
  const regex =
  /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(\/view)?(\?usp=share_link)?$/;
  return regex.test(link);
}
/**
 * @author Henrique de Paula Rodrigues
 * @description Esse comando é utilizado para gerar e registrar os certificados do talks no autentique
 * 
 */
export default new Command({
  name: "registrar-talks",
  description: "Registra os certificados assinados do talks em questão",
  options: [
    {
      name: "titulo",
      description: "O titulo do talks a ser registrado",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "email-assinante",
      description: "O email de quem deve assinar o certificado",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "nome-assinante",
      description: "O nome de quem deve assinar o certificado",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "minutos",
      description: "O tempo do talks em minutos",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "link",
      description: "O link do drive que contem os certificados",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");
    if (!isADM){
      {
        const embed = new EmbedBuilder()
          .setColor(0xf56565)
          .setTitle("Não foi possível utilizar este comando!")
          .setDescription("Você não possui autorização necessária.")
          .setThumbnail(
            "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
          )
          .addFields(
            { name: "Código do erro", value: "401", inline: false },
            {
              name: "Mensagem do erro",
              value:
                "Você precisa ter permissão de administrador para executar esse comando",
              inline: false,
            }
          );
        return await interaction.reply({
          content: "Não foi possível executar este comando",
          ephemeral: true,
          embeds: [embed],
        });
      }
    } 
      const titulo = interaction.options.get("titulo")?.value as string;
      const assigner_name = interaction.options.get("nome-assinante")
        ?.value as string;
      const assigner_mail = interaction.options.get("email-assinante")
        ?.value as string;
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
            const filePath = await createTalksPdf({
              titulo,
              data: formatarData(data),
              listaNomes,
              horas,
              minutos,
            });
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
      
  },
});
