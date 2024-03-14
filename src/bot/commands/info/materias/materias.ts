import { Command } from "../../../structures/Command";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { Materias } from "@/api/modules/materias/entities/materias.entity";
import { saveDataToJson } from "@/bot/utils/googleAPI/getTalksInscriptions";
import { showMateriasAllowedPreRequisitos } from "./util/showMateriasAllowedPreRequisitos";
import { fetchMateriasSeparadasPorPeriodo } from "./util/fetchMateriasSeparadasPorPeriodo";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { seEuNaoFizerTalMateria } from "./util/seEuNaoFizerTalMateria";

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

    const ehPreRequisitoDe: { [key: string]: string[] } = {};
    const ehCorequisitoDe: { [key: string]: string[] } = {};

    for (const materia of materias) {
      if (materia.prerequisitos.length > 0) {
        for (const pre of materia.prerequisitos) {
          if (!ehPreRequisitoDe[pre])
            ehPreRequisitoDe[pre] = [];
          ehPreRequisitoDe[pre].push(materia.nome);
        }
      }

      if (materia.corequisitos.length > 0) {
        for (const co of materia.corequisitos) {
          if (!ehCorequisitoDe[co])
            ehCorequisitoDe[co] = [];
          ehCorequisitoDe[co].push(materia.nome);
        }
      }
    }

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
      // "Integração e Séries",
      // "Cálculo com Funções de Várias Variáveis I",
      // "Fundamentos de Mecânica",
      // "Programação Orientada a Objetos",
      // "Laboratório de Programação Orientada a Objetos",
      // "Sistemas Digitais para Computação",
      // "Laboratório de Sistemas Digitais para Computação",
      // "Filosofia da Tecnologia",
      // "Cálculo com Funções de Várias Variáveis II",
      // "Equações Diferenciais Ordinárias",
      // "Fundamentos de Oscilações, Fluidos e Termodinâmica (OFT)",
      // "Física Experimental - MOFT",
      // "Algoritmos e Estruturas de Dados I",
      // "Laboratório de Algoritmos e Estruturas de Dados I",
      // "Arquitetura e Organização de Computadores I",
      // "Laboratório de Arquitetura e Organização de Computadores I",
      // "Inglês Instrumental I",
      // "Fundamentos de Eletromagnetismo",
      // "Física Experimental - EOFM",
      // "Algoritmos e Estruturas de Dados II",
      // "Métodos Numéricos Computacionais",
      // "Arquitetura e Organização de Computadores II",
      // "Linguagens de Programação",
    ]

    const merda = seEuNaoFizerTalMateria(ehPreRequisitoDe, ehCorequisitoDe, "Fundamentos de Mecânica", materiasFeitas, materias)
    saveDataToJson(merda, `jsons/materias/seEuNaoFizerTalMateria.json`);

    await editLoadingReply({ interaction, title: "materias que posso fazer com base nas materias feitas" })
    const materiasAns = showMateriasAllowedPreRequisitos(materias, materiasFeitas)
    saveDataToJson(materiasAns, `jsons/materias/materiasAns.json`);

    await editLoadingReply({ interaction, title: "materias separadas por curso" })
    const materiasSeparadasPorPeriodo = fetchMateriasSeparadasPorPeriodo(materias)
    saveDataToJson(materiasSeparadasPorPeriodo.materiasPorPeriodo, `jsons/materias/materias.json`);

    return editSucessReply({ interaction, title: "Feito" })
  },
})


