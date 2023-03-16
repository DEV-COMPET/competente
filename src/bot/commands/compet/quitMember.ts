import { EmbedBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "discord.js";
import { CompetianoType } from "../../../api/modules/competianos/entities/competiano.entity";
import { Command } from "../../structures/Command";
import { Member } from "../../typings/Member";
export default new Command({
  name: "quit-member",
  description: "Esse comando é utilizado para anunciar que um membro está de saída",
  options: [{
    name: "exiting_member_email",
    description: "O email do membro de saida do compet",
    type: ApplicationCommandOptionType.String,
    required: true
  }],
  run: async ({ interaction }) => {
    const member = await interaction.guild?.members.fetch(interaction.user.id)
    const isADM = member?.permissions.has("Administrator")
    const url = "http://localhost:4444/competianos/"
    if (isADM) {
      const email = interaction.options.get("exiting_member_email")?.value

      const response = await fetch(`${url}${email}`, {
        method: "get",
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.status >= 200 && response.status < 300) {
        const data: CompetianoType = await response.json()
        if (data.membro_ativo) {
          console.log(data.data_fim);
          const response = await fetch(`${url}${data.nome}`, {
            method: "put",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ membro_ativo: false, data_fim: new Date() })
          })
          if (response.status >= 200 && response.status < 300) {
            const data2: Member = await response.json()
            const embed = new EmbedBuilder()
              .setColor(0x19DD39)
              .setTitle("Diga adeus ao nosso querido membro")
              .setAuthor({ name: interaction.user.username || "abc", iconURL: interaction.user.avatarURL() || undefined })
              .setDescription("Abaixo você encontra as informações sobre o membro de saida")
              .setThumbnail("https://www.pngfind.com/pngs/m/0-226_image-checkmark-green-check-mark-circle-hd-png.png")
              .addFields(
                { name: "Nome", value: data2.nome, inline: false },
                { name: "Data de início", value: data2.data_inicio, inline: false },
                { name: "Data de saída", value: data2.data_fim || "", inline: false },
                { name: "Linkedin", value: data2.linkedin || " Nenhum linkedin informado", inline: false },
                { name: "Email", value: data2.email, inline: false },
              )
            data.url_imagem
              ? embed.setImage(data.url_imagem)
              : embed.setImage("https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png")
            embed.setTimestamp()
            await interaction.reply({ content: "Não foi possível executar este comando", ephemeral: true, embeds: [embed] })
          } else {
            const embed = new EmbedBuilder()
              .setColor(0xF56565)
              .setTitle("Não foi possível completar essa ação!")
              .setDescription("Algo de errado aconteceu.")
              .setThumbnail("https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png")
              .addFields(
                { name: "Código do erro", value: "400", inline: false },
                { name: "Mensagem do erro", value: "Não foi possivel atualizar o membro em questão!", inline: false },
              )
            return await interaction.reply({
              content: "Não foi possível executar este comando",
              ephemeral: true,
              embeds: [embed]
            })
          }

        } else {
          console.log(data.data_fim);

          const embed = new EmbedBuilder()
            .setColor(0xF56565)
            .setTitle("Não foi possível completar essa ação!")
            .setDescription("Algo de errado aconteceu.")
            .setThumbnail("https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png")
            .addFields(
              { name: "Código do erro", value: "401", inline: false },
              { name: "Mensagem do erro", value: "O membro já se encontra inativo!", inline: false },
            )
          return await interaction.reply({
            content: "Não foi possível executar este comando",
            ephemeral: true,
            embeds: [embed]
          })
        }

        await interaction.reply("ok")
      }
      else {
        const data = await response.json()
        console.log(data);

        await interaction.reply("ok")
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor(0xF56565)
        .setTitle("Não foi possível utilizar este comando!")
        .setDescription("Você não possui autorização necessária.")
        .setThumbnail("https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png")
        .addFields(
          { name: "Código do erro", value: "401", inline: false },
          { name: "Mensagem do erro", value: "Você precisa ter permissão de administrador para executar esse comando", inline: false },
        )
      await interaction.reply({
        content: "Não foi possível executar este comando",
        ephemeral: true,
        embeds: [embed]
      })

    }
    return
  }
})