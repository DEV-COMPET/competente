import { Materias } from "@/api/modules/materias/entities/materias.entity"
import { saveDataToJson } from "@/bot/utils/googleAPI/getTalksInscriptions"
import { Periodo } from "./showMateriasRestantesFull"

interface FetchMateriasSeparadasPorPeriodoResponse {
  materiasPorPeriodo: Periodo[]
}

// Retorna lista com materias optativas e obrigatórias separadas por periodo de todos os periodos
export function fetchMateriasSeparadasPorPeriodo(materias: Materias[]): FetchMateriasSeparadasPorPeriodoResponse {

  const materiasPorPeriodo: { periodo: string, obrigatorias: string[], optativas: string[] }[] = []
  materiasPorPeriodo.length = 11
  for (let i = 0; i <= 10; i++)
    materiasPorPeriodo[i] = { obrigatorias: [], optativas: [], periodo: i.toString() }

  for (const materia of materias) {
    if (materia.natureza === "OP")
      materiasPorPeriodo[parseInt(materia.periodo)].optativas.push(materia.nome)
    else
      materiasPorPeriodo[parseInt(materia.periodo)].obrigatorias.push(materia.nome)
  }

  saveDataToJson(materiasPorPeriodo, `jsons/materias/porPeriodo.json`);

  return { materiasPorPeriodo }
}