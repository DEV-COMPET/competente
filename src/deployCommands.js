import { REST, Routes } from 'discord.js';
import fs from'node:fs';
import { fileURLToPath } from "url";
import path from 'path';
import dotenv from "dotenv"
dotenv.config();
const token = process.env.DISCORD_TOKEN ?? "";
const clientId = process.env.DISCORD_CLIENT_ID ?? "";
const guildId = process.env.DISCORD_GUILD_ID ?? "";
const commands = [];
const loadCommands = async () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const commandsPath = path.join(dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
    } else {
      console.log(`[AVISO] O comando na pasta ${filePath} não possui as propriedades "data" ou "execute" obrigatórias.`);
    }
  }
}
await loadCommands()
const rest = new REST({ version: '10' }).setToken(token);
// Grab all the command files from the commands directory you created earlier
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();