import { registerSpeakersCertificatesModal } from "@/bot/modals/compet/registerSpeakersCertificate/registerSpeakersCertificate";
import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";

export default new Command({
  name: "certificar-palestrantes",
  description: "Comando para criar os certificados dos palestrantes",
  run: async function ({ interaction }) {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if (isNotAdmin.isRight())
        return isNotAdmin.value.response

    await interaction.showModal(registerSpeakersCertificatesModal)
    /*if (isADM) {
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
        // const response = await submitToAutentique(
        //   {
        //     numPages: listaNomes.length,
        //     filePath,
        //     titulo,
        //     signer: { email: assigner_mail, name: assigner_name }
        //   }
        // );
      } catch (error: any) {
        return await interaction.reply({ content: error.message, ephemeral: true });
      }
    }*/
  },
});
