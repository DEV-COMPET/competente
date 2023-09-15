import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import { submitToAutentique } from "../../utils/autentiqueAPI";
import { getCompetTalksRegistration } from "../../utils/googleAPI/getCompetTalks";
import { createCertificadoTalksPalestrantes } from "../../utils/python";
import { formatarData } from "@/bot/utils/formatting/formatarData";

export default new Command({
  name: "certificar-palestrantes",
  description: "Comando para criar os certificados dos palestrantes",
  options: [
    {
      name: "titulo",
      type: ApplicationCommandOptionType.String,
      description: "O titulo do evento",
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
      name: "palestrantes",
      type: ApplicationCommandOptionType.String,
      description: "A lista de palestrantes do evento em questão",
      required: true,
    },
    {
      name: "tempo",
      type: ApplicationCommandOptionType.String,
      description: "A duração do evento em questão",
      required: true,
    },
  ],
  run: async function ({ interaction }) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");
    if (isADM) {
      const assigner_name = interaction.options.get("nome-assinante")
        ?.value as string;
      const assigner_mail = interaction.options.get("email-assinante")
        ?.value as string;
      const palestrantes_input = interaction.options.get("palestrantes")
        ?.value as string;
      const listaNomes: string[] = palestrantes_input.split(",");
      const minutos = (
        (interaction.options.get("tempo")?.value as number) % 60
      ).toString();
      const horas = Math.trunc(
        (interaction.options.get("tempo")?.value as number) / 60
      ).toString();
      try {
        await interaction.reply({ content: "boa", ephemeral: true });
        const titulo = interaction.options.get("titulo")?.value as string;
        const registration = await getCompetTalksRegistration(titulo);
        const data = registration.isRight() ? new Date(registration.value.eventRegistrations[0].createTime) : new Date();

        if (registration.isLeft()) {
          return await interaction.reply({
            content: registration.value.error.message,
            ephemeral: true
          })
        }

        const filePath = await createCertificadoTalksPalestrantes({
          titulo,
          listaNomes,
          data: formatarData(data),
          horas,
          minutos,
        });
        const response = await submitToAutentique(
          {
            numPages: listaNomes.length,
            filePath,
            titulo,
            signer: { email: assigner_mail, name: assigner_name }
          }
        );
      } catch (error: any) {
        return await interaction.reply({ content: error.message, ephemeral: true });
      }
    }
  },
});
