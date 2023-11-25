import { ComponentType } from "discord.js";
  import { Command } from "../../structures/Command";
  import selectEventNameMenuData from "../../selectMenus/getTalksInfo/selectEventNameMenuData.json";
  import { getAllEventNames } from "../../utils/googleAPI/getAllEventNames";
  import {
    makeStringSelectMenu,
    makeStringSelectMenuComponent,
  } from "@/bot/utils/modal/makeSelectMenu";
  import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
  import { ExtendedInteraction } from "@/bot/typings/Commands";
  

  /**
 * @author Pedro Vitor Melo Bitencourt
 * @description Comando que obtém informações de um talks selecionado por um select menu
 */
  export default new Command({
    name: "talks-feedback",
    description: "Obtém as informações de um talks",
  
    run: async ({ interaction }) => {
      try {
        await handleInteraction(interaction);
      } catch (error) {
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
  
    const listEventNamesMenu = makeStringSelectMenu({
      customId: customId,
      type: ComponentType.StringSelect,
      options: getAllEventNamesResponse.value.events.map((event) => ({
        label: String(event),
        value: String(event),
      })),
      maxValues: minMax.max,
      minValues: minMax.min,
    });

    await interaction.editReply({
      content: `Escolha um Talks`,
      components: [await makeStringSelectMenuComponent(listEventNamesMenu)],
    });
  }