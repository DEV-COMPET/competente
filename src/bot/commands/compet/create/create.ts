import { createMemberModal } from "@/bot/modals/compet/createMemberModal/createMemberModal";
import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { ChatInputApplicationCommandData } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "createInput.json"
});

export default new Command({
  name, description,
  run: async ({ interaction }) => {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    await interaction.showModal(createMemberModal);
  },
});
