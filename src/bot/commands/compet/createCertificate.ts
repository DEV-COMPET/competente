import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { submitToAutentique } from "../../utils/autentiqueAPI";
import { createCompetCertificate, deleteImage, downloadImage, formatarData } from "../../utils/python";

/**
 * @author Henrique de Paula Rodrigues
 * @description Esse comando é utilizado para gerar e registrar os certificados do talks no autentique
 * 
 */
export default new Command({
  name: "create-certificate",
  description: "cria um certificado único com base no modelo padrão do compet",
  options: [
    {
      name: "descricao",
      description: "A descricao do certificado a ser criado (normalmente o nome do projeto)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "nome-aluno",
      description: "O nome do aluno que deve receber o certificado",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "mail",
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
      name: "data-inicial",
      description: "A data inicial de participação",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "horas-semanais",
      description: "A quantidade de horas semanais",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "data-final",
      description: "A data final de participação",
      type: ApplicationCommandOptionType.String,
      required: true,
    },{
      name: "template",
      description:"O tipo template de certificado a ser utilizado",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    }
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
      const descricao = interaction.options.get("descricao")?.value as string;
      const nome = interaction.options.get("nome-aluno")?.value as string;
      const assigner_name = interaction.options.get("nome-assinante")?.value as string;
      const assigner_mail = interaction.options.get("mail")?.value as string;
      const data_inicial = interaction.options.get("data-inicial")?.value as string;
      const data_final = interaction.options.get("data-final")?.value as string;
      const horas_semanais = interaction.options.get("horas-semanais")?.value as number;
      const template_url = interaction.options.get("template")?.attachment?.url
      let template_path = "" // o diretório onde o template baixado será salvo internamente
      try {
        if(template_url) {
          template_path = await downloadImage(template_url,"compet/templates")
        }
      } catch (error) {
        console.error(error)
        return await interaction.reply({
          content: "Ocorreu um erro ao baixar o template, verifique se o arquivo enviado é uma imagem no formato png ou jpg",
          ephemeral: true,
        });
      }
      if (!descricao) {
        return await interaction.reply({
          content: "Você precisa informar a descricao do evento",
          ephemeral: true,
        });
      }
      if (!nome) {
        return await interaction.reply({
          content: "Você precisa informar o nome de quem vai receber o certificado",
          ephemeral: true,
        });
      }
      try {

        /* Essa parte do código é responsável por gerar o pdf e enviar para o autentique,
        * no caso de um link não ter sido fornecido diretamente no input do comando
        */
            await interaction.reply({ content: "boa", ephemeral: true });
            const filePath = await createCompetCertificate({
              descricao_certificado:descricao,
              data_inicio: formatarData(new Date(data_inicial)),
              nome,
              data_fim:formatarData(new Date(data_final)),
              horas_semanais:horas_semanais.toString(),
              dir_template:template_path
            });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await submitToAutentique({
              numPages:1,
              titulo: descricao,
              filePath,
              signer: { name: assigner_name, email: assigner_mail },
            });
            if(template_path)
              await deleteImage(template_path)
            return;
          } catch (error: any) {
            console.error(error);
            return await interaction.reply({
              content: "Ocorreu um erro no processo de envio do certificado, verifique se os dados fornecidos estão corretos",
              ephemeral: true,
            });
          }
      }
      
  },
);
