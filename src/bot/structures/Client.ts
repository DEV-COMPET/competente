import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  Routes,
  REST
} from "discord.js";
import { CommandType } from "../typings/Commands";
import glob from "glob"
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import * as dotenv from "dotenv";
import { ModalType } from "../typings/Modals";
dotenv.config()
const appId = process.env.DISCORD_CLIENT_ID||""
const token = process.env.DISCORD_TOKEN
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN || "")
const globPromise = promisify(glob);
export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  modals:Collection<string,ModalType> = new Collection()
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] })
  }
  async start() {
    await this.registerModules()
    await this.registerModals()
    await this.login(token)
  }
  async importFile(filepath: string) {
    return (await import(filepath))?.default
  }
  async registerCommands({ guildId, commands }: RegisterCommandsOptions) {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
      await this.guilds.cache.get(guildId)?.commands.set(commands)
      console.log(`Registering commands for ${guildId}`)
    } else {

      await rest.put(Routes.applicationCommands(appId), { body: commands })
      await this.application?.commands.set(commands);
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
      await this.registerCommands({ commands: slashCommands })
    })
    //events
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async filepath => {
      const event: Event<keyof ClientEvents> = await this.importFile(filepath)
      this.on(event.event, event.run)
    })
  }
  async registerModals (){
    const modalFiles = await globPromise(`${__dirname}/../modals/*/*{.ts,.js}`)
    console.log({ modalFiles });
    modalFiles.forEach(async filepath => {
      const modal: ModalType = await this.importFile(filepath)
      if (!modal) return
      console.log(modal);
      this.modals.set(modal.customId, modal)
    })
  }
}