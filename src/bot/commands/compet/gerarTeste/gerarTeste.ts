import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { ChatInputApplicationCommandData } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { gerarTesteModal } from "@/bot/modals/compet/gerarTesteModal/gerarTesteModal";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "gerarTesteInput.json"
});

export default new Command({
  name, description,
  run: async ({ interaction }) => {

    // await interaction.deferReply({ ephemeral: true });

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    await interaction.showModal(gerarTesteModal);
  },
});
