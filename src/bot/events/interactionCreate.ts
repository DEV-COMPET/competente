import { Event } from "../structures/Event";
import { client } from ".."
import { CommandInteractionOptionResolver } from "discord.js";
import { ExtendedInteraction } from "../typings/Commands";
export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply()
    const command = client.commands.get(interaction.commandName)
    if (!command) return interaction.followUp("You have used a non existent command!")
    command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction:interaction as ExtendedInteraction
    })
  }
})