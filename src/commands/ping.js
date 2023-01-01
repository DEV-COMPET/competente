import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Responde com pong")
export async function execute(interaction) {
  await interaction.reply("pong")
}
