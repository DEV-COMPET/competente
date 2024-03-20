import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { getAllEventNames } from "@/bot/utils/googleAPI/getAllEventNames";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import selectEventNameMenuData from "../../../selectMenus/getTalksInfo/selectEventNameMenuData.json";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ComponentType } from "discord.js";
import {
  makeStringSelectMenu,
  makeStringSelectMenuComponent,
} from "@/bot/utils/modal/makeSelectMenu";

export default new Command({
  name: "certificar-palestrantes",
  description: "Comando para criar os certificados dos palestrantes",
  run: async function ({ interaction }) {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if (isNotAdmin.isRight())
        return isNotAdmin.value.response

    try {
      await handleInteraction(interaction);
    }
    catch (error) {
      console.error("Erro ao processar o comando:", error);
    }
  },
});

async function handleInteraction(interaction: ExtendedInteraction) {
  await interaction.deferReply({ ephemeral: true });

  if (interaction.replied) {
    console.log("A interação já foi respondida.");
    return;
  }

  const getAllEventNamesResponse = await getAllEventNames({ interaction });

  if (getAllEventNamesResponse.isLeft()) {
    return await editErrorReply({
      error: getAllEventNamesResponse.value.error,
      interaction,
      title: getAllEventNamesResponse.value.error.message,
    });
  }
  
    const { customId, minMax } = selectEventNameMenuData;

    // Ordem decrescente de acordo com a data
    getAllEventNamesResponse.value.events.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const listEventNamesMenu = makeStringSelectMenu({
      customId: customId,
      type: ComponentType.StringSelect,
      options: getAllEventNamesResponse.value.events.map((event) => ({
      label: String(event.name).substring(0, 80),
      value: String(event.name).substring(0, 80),
      })),
      maxValues: minMax.max,
      minValues: minMax.min,
    });

    await interaction.editReply({
      content: `Escolha um Talks`,
      components: [await makeStringSelectMenuComponent(listEventNamesMenu)],
    });

}