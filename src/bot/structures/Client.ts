import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits } from "discord.js";
import { CommandType } from "../typings/Commands";
import glob from "glob"
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";

const globPromise = promisify(glob);
export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds]})
  }
  start() {
    this.registerModules()
    this.login(process.env.DISCORD_TOKEN)
  }
  async importFile(filepath: string) {
    return (await import(filepath))?.default
  }
  async registerCommands({ guildId, commands }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands)
      console.log(`Registering commands for ${guildId}`)
    } else {
      this.application?.commands.set(commands);
      console.log(`Registering global commands`);
    }
  }
  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
    console.log({ commandFiles });
    commandFiles.forEach(async filepath => {
      const command: CommandType = await this.importFile(filepath)
      if (!command) return
      console.log(command);
      
      this.commands.set(command.name, command)
      slashCommands.push(command)

      //events
      const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
      eventFiles.forEach(async filepath => {
        const event: Event<keyof ClientEvents> = await this.importFile(filepath)
        this.on(event.event, event.run)
      })
    })
  }
}