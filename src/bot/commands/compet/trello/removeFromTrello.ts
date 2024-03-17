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
      const trelloGeralBoardId = env.TRELLO_BOARD_ID;
      const getAllMembersInfoResponse = await getAllMembersInfo(trelloGeralBoardId);
      const { customId, minMax } = selectMemberName;

      const number_people = 75;
      const people = getNRandomPeople(number_people);
      let menuOptions: Person[] = people;
      selectMenuList.splice(0, selectMenuList.length, ...people);

      console.log(people);

      if(people.length > 25) { // split
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
        content: 'Selecione o membro a ser removido',
        components: [await makeStringSelectMenuComponent(nameMenu)]
      });
    }
    catch(error) {
      console.log(error);
    }
}

// Definição da interface para os objetos
interface Person {
  id: number;
  fullName: string;
}

// Função para gerar nomes aleatórios
function generateRandomName(): string {
  const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Alexander', 'Isabella'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez'];
  
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${randomFirstName} ${randomLastName}`;
}

function getNRandomPeople(n : number) : Person[] {
  const people: Person[] = [];

// Adicionando 30 elementos aleatórios ao vetor
for (let i = 1; i < n; i++) {
  const person: Person = {
    id: i + 1,
    fullName: generateRandomName()
  
  };
  people.push(person);
}
return people;
}