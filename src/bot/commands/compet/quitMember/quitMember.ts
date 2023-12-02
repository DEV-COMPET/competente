import { ComponentType } from "discord.js";
import { CompetianoType } from "../../../../api/modules/competianos/entities/competiano.entity";
import { Command } from "../../../structures/Command";
import { description, name } from "./quitMemberadvertirInput.json"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { customId, minMax } from "@/bot/selectMenus/quitSelectedCompetiano/quitSelectedCompetianoData.json";

export default new Command({
  name, description,
  run: async ({ interaction }) => {

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if (isNotAdmin.isRight())
      return isNotAdmin.value.response

    const getCompetianosResponse = await fetchDataFromAPI({
      json: true, method: "GET", url: ""
    })
    if (getCompetianosResponse.isLeft())
      return editErrorReply({
        error: getCompetianosResponse.value.error, interaction, title: "Não foi possivel listar os competianos",
      })

    const competianos: CompetianoType[] = getCompetianosResponse.value.responseData
    const competianosNames = competianos
      .filter(competiano => competiano.membro_ativo)  
      .map(competiano => competiano.nome)
    if (competianosNames.length === 0)
      return editErrorReply({
        error: new Error("Não há competianos cadastrados"), interaction, title: "Não foi possivel listar os competianos",
      })

    const listCompetianosAtivosMenu = makeStringSelectMenu({
      customId, maxValues: minMax.max, minValues: minMax.min,
      options: competianosNames.map(name => ({ label: name, value: name })),
      type: ComponentType.StringSelect,
    })

    return await interaction.editReply({
      content: "Selecione o competiano que deseja remover",
      components: [await makeStringSelectMenuComponent(listCompetianosAtivosMenu)],
    })
  }
});
