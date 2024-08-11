import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { checkIfNotAdmin } from "../../../utils/embed/checkIfNotAdmin";
import { readJsonFile } from "../../../utils/json";
import { fetchDataFromAPI } from "../../../utils/fetch/fetchData";
import { editErrorReply } from "../../../utils/discord/editErrorReply";
import { CompetianoType } from "../../../../api/modules/competianos/entities/competiano.entity";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { nextPage } from "@/bot/selectMenus/compet/selectMenuList";
import { customId as customIdDB, minMax as minMaxDB } from '@/bot/selectMenus/certificadoConclusao/certificadoConclusaoMenuData.json';
import { cancelOption, currentPage, getElementsPerPage, selectMenuList } from "@/bot/selectMenus/compet/selectMenuList";


const { name, description }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "certificadoConclusaoInput.json"
});

export default new Command({
    name, description,
    run: async({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if((isNotAdmin).isRight())
            return isNotAdmin.value.response;

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
         }));
        
        selectMenuList.push(...competianosAtivosNaoTutoresNome);
        let menuOptions = getElementsPerPage(currentPage[currentPage.length-1]);

         if(competianosAtivosNaoTutoresNome.length > 24)
            menuOptions.push(nextPage);

        menuOptions = removeDuplicates(menuOptions);
        
        const competianosDBMenu = makeStringSelectMenu({
            customId: customIdDB,
            type: ComponentType.StringSelect,
            options: menuOptions.map(competiano => ({
              label: competiano.nome,
              value: competiano.nome + "$$$" + competiano.email,
            })),
            maxValues: minMaxDB.max,
            minValues: minMaxDB.min,
        });

        competianosDBMenu.addOptions({ label: cancelOption.nome, value: cancelOption.nome + "$$$" + 
            cancelOption.email
         });

         console.log("Command dataMembros executed");
            
        await interaction.editReply({
            content: 'Selecione o membro',
            components: [await makeStringSelectMenuComponent(competianosDBMenu)]
        });
    }
})

interface ExtractDataRequest {
    competianos: CompetianoType[]
}

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