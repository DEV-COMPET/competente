import { createTalksModal } from "@/bot/modals/compet/createTalks/createTalksModal";
import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ChatInputApplicationCommandData } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "createTalksInput.json"
});

/**
 * @author Pedro Augusto de Portilho Ronzani
 * 
 * Cria novo Talks no banco de dados.
 * cadastra novo evento no youtube
 * altera formulário de inscrição e certificados
 * manda email com formulário de inscrição e link do youtube 
 */

export default new Command({
  name, description,
  run: async function ({ interaction }) {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if (isNotAdmin.isRight())
      return isNotAdmin.value.response

    await interaction.showModal(createTalksModal)
  },
});
