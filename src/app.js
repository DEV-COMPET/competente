import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import dotenv from 'dotenv';
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "url";
dotenv.config();
const token = process.env.DISCORD_TOKEN ?? "";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// 
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
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[AVISO] O comando na pasta ${filePath} não possui as propriedades "data" ou "execute" obrigatórias.`);
    }
  }
}
await loadCommands();
// listeners

// DISCORD LOGADO!
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if(!command){
    console.error(`Nenhum comando ${interaction.commandName}encontrado`);
  return;
  }
  try {
    await command.execute();
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
	console.log(interaction);
});
client.login(token);