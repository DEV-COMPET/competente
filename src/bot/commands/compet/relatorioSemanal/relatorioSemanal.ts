// src/bot/commands/relatorio.ts
import { ChatInputApplicationCommandData } from "discord.js";
import { Command } from "@/bot/structures/Command";
import { readJsonFile } from "@/bot/utils/json";
import { relatorioModal } from "@/bot/modals/compet/relatorioModal/relatorioModal";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "relatorioSemanal.json" // JSON simples com name e description
});

export default new Command({
  name,
  description,
  run: async ({ interaction }) => {
    await interaction.showModal(relatorioModal);
  },
});
