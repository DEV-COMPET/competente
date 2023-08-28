import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  Routes,
  REST,
  Webhook,
  TextChannel,
} from "discord.js";
import { CommandType } from "../typings/Commands";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import * as path from "path";
import { ModalType } from "../typings/Modals";
import { env } from "@/env";

const appId = env.DISCORD_CLIENT_ID;
const token = env.DISCORD_TOKEN;
const rest = new REST({ version: "10" }).setToken(
  env.DISCORD_TOKEN
);
const globPromise = promisify(glob);
export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  modals: Collection<string, ModalType> = new Collection();
  webhook?: Webhook;
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
  }
  async start() {
    await this.registerModules();
    await this.login(token);
  }
  async importFile(filepath: string) {
    return (await import(filepath))?.default;
  }
  async registerCommands({ guildId, commands }: RegisterCommandsOptions) {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(appId, guildId), {
        body: commands,
      });
      await this.guilds.cache.get(guildId)?.commands.set(commands);
    } else {
      await rest.put(Routes.applicationCommands(appId), { body: commands });
      await this.application?.commands.set(commands);
    }
  }
  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    try {
      const pattern = "**/*{.ts,.js}";
      const directory = path.join(__dirname, "..", "commands");
      const commandFiles = await globPromise(pattern, { cwd: directory });
      commandFiles.forEach(async (filepath) => {
        const command: CommandType = await this.importFile(
          path.join(directory, filepath)
        );
        if (!command) return;
        this.commands.set(command.name, command);
        slashCommands.push(command);
      });
    } catch (error) {
      console.error(error);
    }
    // import events
    try {
      const pattern = "*{.ts,.js}";
      const directory = path.join(__dirname, "..", "events");
      const eventFiles = await globPromise(pattern, { cwd: directory });
      eventFiles.forEach(async (filepath) => {
        const event: Event<keyof ClientEvents> = await this.importFile(
          path.join(directory, filepath)
        );
        if (event.typeEvent === "on") this.on(event.event, event.run);
        else this.once(event.event, event.run);
      });
    } catch (error) {
      console.error(error);
    }
    const createdCommands = this.commands.map((command) => command);
    await this.registerCommands({ commands: createdCommands });
    await this.registerModals();
  }
  async registerModals() {
    try {
      const pattern = "**/*{.ts,.js}";
      const directory = path.join(__dirname, "..", "modals");
      const modalFiles = await globPromise(pattern, { cwd: directory });
      console.log({ modalFiles });
      modalFiles.forEach(async (filepath) => {
        const modal: ModalType = await this.importFile(
          path.join(directory, filepath)
        );
        if (!modal) return;
        this.modals.set(modal.customId, modal);
      });
    } catch (error) {
      console.error(error);
    }
  }
  async createWebhook({
    webhookName,
    channelName,
  }: {
    webhookName: string;
    channelName: string;
  }) {
    const guildId = env.DISCORD_GUILD_ID;
    const guild = this.guilds.cache.get(guildId);
    if (!guild) {
      throw new Error("Servidor não encontrado.");
    }
    const channels = guild.channels.cache.find(
      (c) => c.name.toLowerCase() === channelName.toLocaleLowerCase()
    ) as TextChannel;
    if (!channels) {
      throw new Error(`Nenhum canal ${channelName} encontrado.`);
    }
    const webhooks = await channels.fetchWebhooks();
    const existingWebhook = webhooks.find(
      (webhook) => webhook.name === webhookName
    );
    if (!existingWebhook) {
      const webhook = await channels.createWebhook({
        name: webhookName,
        avatar: "https://i.ibb.co/rpkBgxZ/msg-1183775647-43870.jpg",
        reason:
          "Um Webhook para ajudar no processo de assinatura de certificados",
      });
      this.webhook = webhook;
    }
    this.webhook = existingWebhook;
  }
}
