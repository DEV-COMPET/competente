import { Command } from "../../../structures/Command";
import { ChatInputApplicationCommandData, ComponentType } from "discord.js";
import { checkIfNotAdmin } from "../../../utils/embed/checkIfNotAdmin";
import { readJsonFile } from "../../../utils/json";
import { fetchDataFromAPI } from "../../../utils/fetch/fetchData";
import { editErrorReply } from "../../../utils/discord/editErrorReply";
import { CompetianoType } from "../../../../api/modules/competianos/entities/competiano.entity";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { nextPage } from "@/bot/selectMenus/compet/selectMenuList";
import { handlingRemove } from "./utils/handleRemove";
import { customId as customIdDB, minMax as minMaxDB } from '@/bot/selectMenus/database/updateMemberStatus.json';
import { cancelOption, currentPage, getElementsPerPage, selectMenuList } from "@/bot/selectMenus/compet/selectMenuList";


const { name, description }: ChatInputApplicationCommandData = readJsonFile({
    dirname: __dirname,
    partialPath: "removeFromCompetInput.json"
});

export default new Command({
    name, description,
    run: async({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if((isNotAdmin).isRight())
            return isNotAdmin.value.response;

        handlingRemove.push(interaction);

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
         
         //const randomPeople = generateRandomArray(75);
         //selectMenuList.push(...randomPeople);
         
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
            
        await interaction.editReply({
            content: 'Selecione o membro a ser removido',
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

async function extractData({ competianos }: ExtractDataRequest): Promise<ExtractDataResponse[]> {
    // Filter active competianos
    const activeCompetianos: ExtractDataResponse[] = competianos.filter(competiano => competiano.membro_ativo === true)
                                         .filter(competiano => !competiano.tutor)
                                         .map(competiano => ({ nome: competiano.nome, email: competiano.email }));
    return activeCompetianos;
}

// TODO: REMOVER
interface Person {
    nome: string;
    email: string;
}

function generateRandomName(): string {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Anna", "Mike", "Sara"];
    const lastNames = ["Smith", "Doe", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function generateRandomEmail(name: string): string {
    const domains = ["example.com", "test.com", "sample.org", "mail.com"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${name.replace(" ", ".").toLowerCase()}@${domain}`;
    return email;
}

function generateRandomArray(n: number): Person[] {
    const result: Person[] = [];
    for (let i = 0; i < n; i++) {
        const name = generateRandomName() + (i + 1);
        const email = generateRandomEmail(name) + (i+1);
        result.push({ nome: name, email: email });
    }
    return result;
}