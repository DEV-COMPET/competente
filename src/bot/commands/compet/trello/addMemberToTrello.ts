import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { addMemberToTrelloModal } from "@/bot/modals/compet/addMemberToTrello/addMemberToTrelloModal";
import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { customId, options, minMax } from './../../../selectMenus/trello/selectTeam.json';

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "addMemberToTrello.json"
});

export default new Command({
  name, description,
  run: async ({ interaction }) => {
    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    console.log("oioioioio");

    await interaction.showModal(addMemberToTrelloModal);
  },
});
