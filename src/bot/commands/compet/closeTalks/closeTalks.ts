import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ChatInputApplicationCommandData } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { closeTalksModal } from "@/bot/modals/compet/closeTalksModal/closeTalksModal";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "closeTalksInput.json"
});

export default new Command({
  name, description,
  run: async function ({ interaction }) {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if (isNotAdmin.isRight())
      return isNotAdmin.value.response

    await interaction.showModal(closeTalksModal)
  },
});
