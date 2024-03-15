import { Command } from "@/bot/structures/Command";
import { readJsonFile } from "@/bot/utils/json";
import { ChatInputApplicationCommandData } from "discord.js";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { inserirInfoModal } from "@/bot/modals/compet/inserirInfo/inserirInfoModal";


const { name, description }: ChatInputApplicationCommandData = readJsonFile({
      dirname: __dirname,
      partialPath: "inserirInfoInput.json"
})

export default new Command ({
      name, description,
      run: async ({ interaction }) => {
            const isNotAdmin = await checkIfNotAdmin(interaction);
            if (isNotAdmin.isRight()) 
                  return isNotAdmin.value.response;

            await interaction.showModal(inserirInfoModal);
      }
})