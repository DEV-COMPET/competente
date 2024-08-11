import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { submitToAutentique } from "../../utils/autentiqueAPI";
import { createCertificate } from "../../utils/python";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { promises as fsPromise } from "fs"
import fs from 'fs';
import path from 'path';
import { competDirectories } from "@/bot/utils/python/constants";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";

async function deleteImage(img_path: string) {
  await fsPromise.unlink(path.join(__dirname, img_path))
}

async function downloadImage(url: string, dest: string) {
  const response = await fetch(url);
  const blob = await response.blob()
  const arrayBuffer = await blob.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fsPromise.writeFile(path.join(__dirname, dest, "template.png"), buffer, { flag: "w" })
  return dest + "/template.png"
}

function formatTextToMaxLineLength(text: string, maxLineLength: number) {
  const words = text.split(' ');
  let currentLineLength = 0;
  let formattedText = '';

  words.forEach((word) => {
    if (currentLineLength + word.length <= maxLineLength) {
      formattedText += word + ' ';
      currentLineLength += word.length + 1;
    } else {
      formattedText += '\n' + word + ' ';
      currentLineLength = word.length + 1;
    }
  });

  return formattedText.trim();
}

const buildTXTFileFromModel = ({ nome, data_inicio, data_fim, horas_semanais, descricao_certificado }: ISingleCertificateProps) => {
  const text_dir = path.join(__dirname, competDirectories.content)
  const file = fs.readFileSync(text_dir, 'utf-8')
  const new_data = file.replace("%nome%", nome)
    .replace("%data_inicio%", data_inicio)
    .replace("%data_fim%", data_fim)
    .replace("%horas_semanais%", horas_semanais)
    .replace("%evento%", descricao_certificado);
  const newText = formatTextToMaxLineLength(new_data, 60)
  const new_text_dir = `${competDirectories.content.split('/')[0]}/new-${competDirectories.content.split('/')[1]}`
  fs.writeFileSync(path.join(__dirname, new_text_dir), newText, { flag: "w" });
  return new_text_dir
}

export interface ISingleCertificateProps {
  descricao_certificado: string,
  nome: string,
  data_inicio: string,
  data_fim: string,
  horas_semanais: string
  dir_template?: string
}

/**
 * @author Henrique de Paula Rodrigues
 * @description Cria um certificado de participação único
 * @returns {Promise <string>} path do certificado criado
 */
export async function createCompetCertificate({ nome, data_inicio, data_fim, horas_semanais, descricao_certificado, dir_template }: ISingleCertificateProps): Promise<string> {
  const text_dir = buildTXTFileFromModel({ nome, data_fim, data_inicio, descricao_certificado, horas_semanais }) // Arquivo de texto que contém o texto do certificado
  const template_dir = dir_template || competDirectories.template // Imagem que contém o template do certificado
  const response = await createCertificate({ data: data_inicio, horas: horas_semanais, data_final: data_fim, listaNomes: nome, template_dir, text_dir, minutos: "0" })

  if (response.isLeft())
    throw new Error("Erro na criação do certificado!");

  const path_to_certificate: string = response.value.response[0]
  return path_to_certificate
}


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
    }, {
      name: "template",
      description: "O tipo template de certificado a ser utilizado",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    }
  ],
  run: async ({ interaction }) => {

    await interaction.deferReply({ ephemeral: true })

    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");
    if (!isADM) {
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
      if (template_url) {
        template_path = await downloadImage(template_url, "compet/templates.png")
      }
    } catch (error) {
      console.error(error)

      return await editErrorReply({
        interaction, title: "Ocorreu um erro ao baixar o template, verifique se o arquivo enviado é uma imagem no formato png ou jpg",
         error: new Error()
      })

      // return await interaction.reply({
      //   content: "Ocorreu um erro ao baixar o template, verifique se o arquivo enviado é uma imagem no formato png ou jpg",
      //   ephemeral: true,
      // });
    }
    if (!descricao) {

      return await editErrorReply({
        interaction, title: "Você precisa informar a descricao do evento",
         error: new Error()
      })

      // return await interaction.reply({
      //   content: "Você precisa informar a descricao do evento",
      //   ephemeral: true,
      // });
    }
    if (!nome) {

      return await editErrorReply({
        interaction, title: "Você precisa informar o nome de quem vai receber o certificado",
         error: new Error()
      })

      // return await interaction.reply({
      //   content: "Você precisa informar o nome de quem vai receber o certificado",
      //   ephemeral: true,
      // });
    }
    try {

      /* Essa parte do código é responsável por gerar o pdf e enviar para o autentique,
      * no caso de um link não ter sido fornecido diretamente no input do comando
      */
      // await interaction.reply({ content: "boa", ephemeral: true });
      const filePath = await createCompetCertificate({
        descricao_certificado: descricao,
        data_inicio: formatarData(new Date(data_inicial)),
        nome,
        data_fim: formatarData(new Date(data_final)),
        horas_semanais: horas_semanais.toString(),
        dir_template: template_path
      });
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // await submitToAutentique({
      //   numPages: 1,
      //   titulo: descricao,
      //   filePath,
      //   signer: { name: assigner_name, email: assigner_mail },
      // });
      // if (template_path)
      //   await deleteImage(template_path)

      return await editSucessReply({
        interaction, title: "Certificado criado e enviado com sucesso " + filePath
      })

    } catch (error: any) {
      console.error(error);

      return await editErrorReply({
        interaction, title: "Ocorreu um erro no processo de envio do certificado, verifique se os dados fornecidos estão corretos",
         error
      })

      // return await interaction.reply({
      //   content: "Ocorreu um erro no processo de envio do certificado, verifique se os dados fornecidos estão corretos",
      //   ephemeral: true,
      // });
    }
  }

},
);
