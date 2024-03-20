import { Command } from "../../../structures/Command";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { Materias } from "@/api/modules/materias/entities/materias.entity";
import { saveDataToJson } from "@/bot/utils/googleAPI/getTalksInscriptions";
import { fetchMateriasSeparadasPorPeriodo } from "./util/fetchMateriasSeparadasPorPeriodo";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { seEuNaoFizerTalMateria } from "./util/seEuNaoFizerTalMateria";
import { showMateriasRestantesFull } from "./util/showMateriasRestantesFull";
import { showMateriasAllowedPreRequisitos } from "./util/showMateriasAllowedPreRequisitos";
import { gerarEhPreCorequisito } from "./util/gerarEhPreECo";

export default new Command({
  name: 'materias',
  description: "chama materias",
  run: async ({ interaction }) => {

    await interaction.deferReply({ ephemeral: true });

    await editLoadingReply({ interaction, title: "conferindo se é ADM" })

    const isNotAdmin = await checkIfNotAdmin(interaction)
    if ((isNotAdmin).isRight())
      return isNotAdmin.value.response

    await editLoadingReply({ interaction, title: "fetching materiais" })

    // await interaction.showModal(createMateriaModal);
    const materiasResponse = await fetchDataFromAPI({ json: true, url: "/materias/", method: "GET" })
    if (materiasResponse.isLeft())
      return await editErrorReply({ interaction, error: materiasResponse.value.error, title: "Erro ao buscar competentes" })

    const materias: Materias[] = materiasResponse.value.responseData

    saveDataToJson(materias, `jsons/materias/materiasObj.json`);

    const { ehCorequisitoDe, ehPreRequisitoDe } = gerarEhPreCorequisito({ materias })

    saveDataToJson(ehPreRequisitoDe, `jsons/materias/ehPreRequisitoDe.json`);
    saveDataToJson(ehCorequisitoDe, `jsons/materias/ehCorequisitoDe.json`);

    const materiasFeitas: string[] = [
      "Cálculo com Funções de uma Variável Real",
      "Geometria Analítica e Álgebra Linear",
      "Lógica de Programação",
      "Laboratório de Lógica de Programação",
      "Matemática Discreta",
      "Contexto Social e Profissional da Engenharia de Computação",
      "Metodologia Científica",
      "Integração e Séries",
      "Cálculo com Funções de Várias Variáveis I",
      "Fundamentos de Mecânica",
      "Programação Orientada a Objetos",
      "Laboratório de Programação Orientada a Objetos",
      "Sistemas Digitais para Computação",
      "Laboratório de Sistemas Digitais para Computação",
      "Filosofia da Tecnologia",
      "Cálculo com Funções de Várias Variáveis II",
      "Equações Diferenciais Ordinárias",
      "Fundamentos de Oscilações, Fluidos e Termodinâmica (OFT)",
      "Física Experimental - MOFT",
      "Algoritmos e Estruturas de Dados I",
      "Laboratório de Algoritmos e Estruturas de Dados I",
      "Arquitetura e Organização de Computadores I",
      "Laboratório de Arquitetura e Organização de Computadores I",
      "Inglês Instrumental I",
      "Fundamentos de Eletromagnetismo",
      "Física Experimental - EOFM",
      "Algoritmos e Estruturas de Dados II",
      "Métodos Numéricos Computacionais",
      "Arquitetura e Organização de Computadores II",
      "Linguagens de Programação",
    ]

    const materiasPropositalmenteNaoFeitas = [
      "Circuitos Elétricos"
    ]

    // vetor com materias que serao atrasadas um semestre
    const materiasTravadasUmSemestre = seEuNaoFizerTalMateria({
      materiasFeitas, materias, ehPreRequisitoDe, ehCorequisitoDe, materiasPropositalmenteNaoFeitas
    })
    saveDataToJson(materiasTravadasUmSemestre, `jsons/materias/seEuNaoFizerTalMateria.json`);

    await editLoadingReply({ interaction, title: "materias que posso fazer com base nas materias feitas" })

    // mostra materias que ainda faltam no curso pra vc fazer
    const materiasRestantesCurso = showMateriasRestantesFull(materias, materiasFeitas)
    saveDataToJson(materiasRestantesCurso, `jsons/materias/materiasRestantesCurso.json`);

    const materiasPretendidasFazer: string[] = [
      "Banco de Dados I",
      "Laboratório de Banco de Dados I",
      "Engenharia de Software I",
      "Laboratório de Engenharia de Software I",
      "Estatística",
      "Linguagens Formais e Autômatos",
      "Circuitos Elétricos",
    ]

    // motra materias que posso fazer imediatamente por conta dos pre reqiusitos
    const materiasAllowedPreRequisitos = showMateriasAllowedPreRequisitos({ materias, materiasFeitas, materiasPretendidasFazer })
    saveDataToJson(materiasAllowedPreRequisitos, `jsons/materias/materiasAllowedPreRequisitos.json`);

    await editLoadingReply({ interaction, title: "materias separadas por curso" })

    // mostra todas as materias do curso separadas por periodo
    const materiasSeparadasPorPeriodo = fetchMateriasSeparadasPorPeriodo(materias)
    saveDataToJson(materiasSeparadasPorPeriodo.materiasPorPeriodo, `jsons/materias/materias.json`);

    return editSucessReply({ interaction, title: "Feito" })
  },
})


