import { env } from '@/env'
import { ComponentType } from "discord.js";
import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersInfo";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import selectMemberName from './../../../selectMenus/trello/selectMemberName.json';
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { selectMenuList, nextPage } from '@/bot/selectMenus/trello/selectMenuList';

export async function handleRemoveFromTrelloInteraction(interaction: ExtendedInteraction) {
  // await interaction.deferReply({ ephemeral: true });
    try {
      const trelloGeralBoardId = env.TRELLO_BOARD_ID;
      const getAllMembersInfoResponse = await getAllMembersInfo(trelloGeralBoardId);
      const { customId, minMax } = selectMemberName;

      let menuOptions = getAllMembersInfoResponse;
      selectMenuList.splice(0, selectMenuList.length, ...menuOptions);

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
    }
    catch(error) {
      console.log(error);
    }
}