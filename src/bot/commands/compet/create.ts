import { modal } from "@/bot/modals/compet/createMemberModal/createMemberModal";
import { Command } from "../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"

export default new Command({
  name: "create",
  description: "Esse comando adiciona um novo competiano ao compet",
  run: async ({ interaction }) => {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    await interaction.showModal(modal);
  },
});
