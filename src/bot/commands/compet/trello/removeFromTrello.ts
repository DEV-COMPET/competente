import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { Command } from "../../../structures/Command";
import { removeFromTrelloModal } from "@/bot/modals/compet/trello/removeFromTrelloModal";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersNames";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import selectMemberName from './selectMemberName.json';
import { ExtendedInteraction } from "@/bot/typings/Commands";

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "removeFromTrello.json"
});

export default new Command({
  name, description,
  run: async ({ interaction }) => {
    try { await handleInteraction(interaction); }
    catch(error) { console.error('Error ao processar o comando de remover do Trello', error); }
}});

async function handleInteraction(interaction: ExtendedInteraction) {
  await interaction.deferReply({ ephemeral: true });

  if(interaction.replied) {
    console.error('A interação já foi respondida');
    return;
  }

  const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    try {
      const getAllMembersInfoResponse = await getAllMembersInfo();
      const membersNames = getAllMembersInfoResponse.map(member => member.fullName);

      const { customId, minMax } = selectMemberName;

      const nameMenu = makeStringSelectMenu({
        customId,
        type: ComponentType.StringSelect,
        options: getAllMembersInfoResponse.map(member => ({
          label: member.fullName,
          value: member.id,
        })),
        maxValues: minMax.max,
        minValues: minMax.min,
      });

      await interaction.editReply({
        content: 'Selecione o membro a ser removido',
        components: [await makeStringSelectMenuComponent(nameMenu)]
      });
    }
    catch(error) {
      console.log(error);
    }

    // await interaction.showModal(removeFromTrelloModal);
}