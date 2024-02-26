import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { Command } from "../../../structures/Command";
import { removeFromTrelloModal } from "@/bot/modals/compet/trello/removeFromTrelloModal";
import { ChatInputApplicationCommandData } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "removeFromTrello.json"
});

export default new Command({
  name, description,
  run: async ({ interaction }) => {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    console.log("oioi1")
    await interaction.showModal(removeFromTrelloModal);
  },
});
