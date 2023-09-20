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
  },
});
