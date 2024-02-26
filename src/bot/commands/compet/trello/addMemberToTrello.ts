import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { addMemberToTrelloModal } from "@/bot/modals/compet/addMemberToTrello/addMemberToTrelloModal";
import { Command } from "../../../structures/Command";

export default new Command({
  name: "addtrellooo",
  description: "Adiciona um membro ao trello",
  run: async ({ interaction }) => {
    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    console.log("oi1");
    await interaction.showModal(addMemberToTrelloModal);
  },
});
