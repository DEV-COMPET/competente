import { env } from '@/env'
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersInfo";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import selectMemberName from './../../../selectMenus/trello/selectMemberName.json';
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { selectMenuList, currentPage, nextPage } from '@/bot/selectMenus/trello/selectMenuList';
import { ExtendedStringSelectMenuInteraction } from '@/bot/typings/SelectMenu';
import { removeFromDriveModal } from '@/bot/modals/compet/removeFromDrive/removeFromDriveModal';

export async function handleRemoveFromTrelloInteraction(interaction: ExtendedInteraction) {
  // await interaction.deferReply({ ephemeral: true });
    try {
      const trelloGeralBoardId = env.TRELLO_BOARD_ID;
      const getAllMembersInfoResponse = await getAllMembersInfo(trelloGeralBoardId);
      const { customId, minMax } = selectMemberName;

      let menuOptions = getAllMembersInfoResponse;
      selectMenuList.splice(0, selectMenuList.length, ...menuOptions);

      console.log(menuOptions);

      if(menuOptions.length > 25) { // split
        menuOptions = menuOptions.slice(0, 24);
        menuOptions.push(nextPage);
      }

      const nameMenu = makeStringSelectMenu({
        customId,
        type: ComponentType.StringSelect,
        options: menuOptions.map(member => ({
          label: member.fullName,
          value: member.id.toString(),
        })),
        maxValues: minMax.max,
        minValues: minMax.min,
      });

      await interaction.editReply({
        content: 'Selecione o membro a ser removido do Trello',
        components: [await makeStringSelectMenuComponent(nameMenu)]
      });
      console.log("Opa, chegou aqui após Trello******************************");
      // await interaction.showModal(removeFromDriveModal);
    }
    catch(error) {
      console.log(error);
    }
}