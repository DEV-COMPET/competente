import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { readJsonFile } from "@/bot/utils/json";
import { customId, minMax } from "@/bot/selectMenus/advertir/advertirSelectMenuData.json";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { cancelOption, currentPage, getElementsPerPage, nextPage, selectMenuList } from "@/bot/selectMenus/advertir/selectMenuList";

export const handlingAdvertir: ExtendedInteraction[] = [];

const { name, description }: ChatInputApplicationCommandData = readJsonFile({
  dirname: __dirname,
  partialPath: "advertirInput.json"
});

export default new Command({
  name, description,
  run: async function ({ interaction }) {
    await interaction.deferReply({ ephemeral: true });

    const isNotAdmin = await checkIfNotAdmin(interaction);
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response;

    handlingAdvertir.push(interaction);

    const competentesResponse = await fetchDataFromAPI({
      json: true, url: "/competianos/", method: "GET"
    })
    if (competentesResponse.isLeft())
      return await editErrorReply({
        interaction, error: competentesResponse.value.error, title: "Erro ao buscar competianos"
      })

    const competianos: CompetianoType[] = competentesResponse.value.responseData
    const competianosAtivos = competianos.filter(competiano => competiano.membro_ativo === true)
    const competianosAtivosNaoTutores = competianosAtivos.filter(competiano => competiano.tutor === false);
    const competianosAtivosNaoTutoresNome = competianosAtivosNaoTutores.map(competiano => ({
      nome: competiano.nome, email: competiano.email
    })).sort((a, b) => a.nome.localeCompare(b.nome));

    selectMenuList.push(...competianosAtivosNaoTutoresNome);
    let menuOptions = getElementsPerPage(currentPage[currentPage.length - 1]);

    if (competianosAtivosNaoTutoresNome.length > 24)
      menuOptions.push(nextPage);

    menuOptions = removeDuplicates(menuOptions);
    const competianosDBMenu = makeStringSelectMenu({
      customId,
      type: ComponentType.StringSelect,
      options: menuOptions.map(competiano => ({
        label: competiano.nome,
        value: competiano.nome + "$$$" + competiano.email,
      })),
      maxValues: minMax.max,
      minValues: minMax.min,
    });

    competianosDBMenu.addOptions({
      label: cancelOption.nome, 
      value: cancelOption.nome + "$$$" + cancelOption.email
    });

    await interaction.editReply({
      content: 'Selecione o membro a ser advertido',
      components: [await makeStringSelectMenuComponent(competianosDBMenu)]
    });
  },
});

interface ExtractDataResponse {
  email: string,
  nome: string
}

function removeDuplicates(arr: ExtractDataResponse[]): ExtractDataResponse[] {
  const uniqueMap: { [key: string]: boolean } = {};
  const uniqueArray: ExtractDataResponse[] = [];

  arr.forEach(obj => {
    if (!uniqueMap[obj.nome]) {
      uniqueMap[obj.nome] = true;
      uniqueArray.push(obj);
    }
  });

  return uniqueArray;
}
