import { readJsonFile } from "@/bot/utils/json";
import { Command } from "@/bot/structures/Command";
import { ChatInputApplicationCommandData } from "discord.js";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";

import { sendInviteModal } from "@/bot/modals/compet/sendInvite/sendInviteModal";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
   dirname: __dirname,
   partialPath: "sendInviteInput.json"
})

export default new Command({
   name, description,
   run: async ({ interaction }) => {
      
      const isNotAdmin = await checkIfNotAdmin(interaction);
      if(isNotAdmin.isRight())
         return isNotAdmin.value.response;

      await interaction.showModal(sendInviteModal);
   }
})