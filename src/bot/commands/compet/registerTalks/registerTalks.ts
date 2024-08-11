import { ChatInputApplicationCommandData } from "discord.js";
import { Command } from "@/bot/structures/Command";
import { readJsonFile } from "@/bot/utils/json";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { registerTalksModal } from "@/bot/modals/compet/registerTalks/registerTalksModal";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "registerTalksInput.json"
});

/**
 * @author Henrique de Paula Rodrigues
 * @description Esse comando é utilizado para gerar e registrar os certificados do talks no autentique
 * 
 */
export default new Command({
  name,
  description,
  run: async ({ interaction }) => {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    await interaction.showModal(registerTalksModal)
  },
});
