import { modal } from "../../modals/compet/createMemberModal";
import { Command } from "../../structures/Command";

export default new Command({
  name: "create",
  description: "Esse comando adiciona um novo competiano ao compet",
  run: async ({ interaction ,client}) => {
    await interaction.showModal(modal)
  }
})