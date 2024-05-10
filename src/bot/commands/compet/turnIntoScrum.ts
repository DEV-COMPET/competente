import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CompetianoType } from "../../../api/modules/competianos/entities/competiano.entity";
import { Command } from "../../structures/Command";
import { Member } from "../../typings/Member";
export default new Command({
  name: "tornar-scrum",
  description:
    "Esse comando é utilizado para anunciar que um membro está de saída",
  options: [
    {
      name: "new_scrum_mail",
      description: "O email do mais novo scrum",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ interaction }) => {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");
    const url = "http://localhost:3000/competianos";

    // Esse comando verifica se o usúario é um administrador e caso seja, torna possível tornar um membro do compet Scrum do compet
    if (isADM) {
      const email = interaction.options.get("new_scrum_mail")?.value;

      const response = await fetch(`${url}/${email}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status >= 200 && response.status < 300) {
        const data: CompetianoType = await response.json();
        if (!data.scrum_master) {
          const response = await fetch(`${url}/${data.nome}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scrum_master: true }),
          });
          if (response.status >= 200 && response.status < 300) {
            const data2: Member = await response.json();
            const embed = new EmbedBuilder()
              .setColor(0x19dd39)
              .setTitle("Dê os parabens para o mais novo Scrum Master!")
              .setAuthor({
                name: interaction.user.username || "abc",
                iconURL: interaction.user.avatarURL() || undefined,
              })
              .setDescription("Tem manda chuva novo no pedaço!")
              .setThumbnail(
                "https://img2.gratispng.com/20180303/ueq/kisspng-crown-king-scalable-vector-graphics-clip-art-cartoon-exquisite-crown-5a9b7b715dca16.7784451515201391213842.jpg"
              )
              .addFields(
                { name: "Nome", value: data2.nome, inline: false },
                {
                  name: "Linkedin",
                  value: data2.linkedin || " Nenhum linkedin informado",
                  inline: false,
                },
                { name: "Email", value: data2.email, inline: false }
              );
            data.url_imagem
              ? embed.setImage(data.url_imagem)
              : embed.setImage(
                  "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                );
            embed.setTimestamp();
            return await interaction.reply({
              content: "O mais novo scrum tá na área",
              ephemeral: false,
              embeds: [embed],
            });
          } else {
            const embed = new EmbedBuilder()
              .setColor(0xf56565)
              .setTitle("Não foi possível completar essa ação!")
              .setDescription("Algo de errado aconteceu.")
              .setThumbnail(
                "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
              )
              .addFields(
                { name: "Código do erro", value: "400", inline: false },
                {
                  name: "Mensagem do erro",
                  value:
                    "Não foi possivel tornar o membro em questão scrum do compet!",
                  inline: false,
                }
              );
            return await interaction.reply({
              content: "Não foi possível executar este comando",
              ephemeral: true,
              embeds: [embed],
            });
          }
        } else {

          const embed = new EmbedBuilder()
            .setColor(0xf56565)
            .setTitle("Não foi possível completar essa ação!")
            .setDescription("Algo de errado aconteceu.")
            .setThumbnail(
              "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
            )
            .addFields(
              { name: "Código do erro", value: "401", inline: false },
              {
                name: "Mensagem do erro",
                value: "O membro já é scrum!",
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
    } else {
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
  },
});
