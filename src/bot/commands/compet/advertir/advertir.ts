import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ChatInputApplicationCommandData } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { advertirModal } from "@/bot/modals/compet/advertir/advertirModal";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "advertirInput.json"
});

export default new Command({
  name, description,
  run: async function ({ interaction }) {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if (isNotAdmin.isRight())
      return isNotAdmin.value.response

    await interaction.showModal(advertirModal)
  },
});
