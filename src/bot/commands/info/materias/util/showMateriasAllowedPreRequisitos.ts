import { Materias } from "@/api/modules/materias/entities/materias.entity"
import { fetchMateriasSeparadasPorPeriodo } from "./fetchMateriasSeparadasPorPeriodo"
import { Periodo } from "./showMateriasRestantesFull"

interface ShowMateriasAllowedPreRequisitosRequest {

    materiasFeitas: string[],
    materiasPretendidasFazer: string[],
    materias: Materias[]

}

export function showMateriasAllowedPreRequisitos({ materias, materiasFeitas, materiasPretendidasFazer }: ShowMateriasAllowedPreRequisitosRequest) {

    const { materiasPorPeriodo } = fetchMateriasSeparadasPorPeriodo(materias)

    const materiasFeitasSet = new Set(materiasFeitas)
    const materiasPretendidasFazerSet = new Set(materiasPretendidasFazer)
    const materiasQueAtendemPreRequisitos = new Set<string>()

    const retorno: Periodo[] = []

    for (const periodo of materiasPorPeriodo) {
        for (const materia of periodo.obrigatorias) {
            if (materiasFeitasSet.has(materia)) continue

            const materiaObj = materias.find(materiaObj => materiaObj.nome === materia) as Materias
            if (materiaObj.prerequisitos.length > 0) {
                let doneAll: boolean = true;
                for (const preRequisito of materiaObj.prerequisitos) {
                    if (!materiasFeitasSet.has(preRequisito)) {
                        doneAll = false;
                        break;
                    }
                }
                if (!doneAll) continue
            }

            materiasQueAtendemPreRequisitos.add(materia)

            const indexAlreadyAdded = retorno.findIndex(retorno => retorno.periodo === periodo.periodo)
            if (indexAlreadyAdded === -1)
                retorno.push({ periodo: periodo.periodo, obrigatorias: [materia], optativas: [] })
            else
                retorno[indexAlreadyAdded].obrigatorias.push(materia)
        }

        for (const materia of periodo.optativas) {
            if (materiasFeitasSet.has(materia)) continue

            const materiaObj = materias.find(materiaObj => materiaObj.nome === materia) as Materias

            if (materiaObj.prerequisitos.length > 0) {
                let doneAll: boolean = true;

                for (const preRequisito of materiaObj.prerequisitos) {
                    if (!materiasFeitasSet.has(preRequisito)) {
                        doneAll = false;
                        break;
                    }
                }
                if (!doneAll) continue
            }

            materiasQueAtendemPreRequisitos.add(materia)

            const indexAlreadyAdded = retorno.findIndex(retorno => retorno.periodo === periodo.periodo)

            if (materiaObj.natureza === "OB") {
                if (indexAlreadyAdded === -1)
                    retorno.push({ periodo: periodo.periodo, obrigatorias: [materia], optativas: [] })
                else
                    retorno[indexAlreadyAdded].obrigatorias.push(materia)
            } else {
                if (indexAlreadyAdded === -1)
                    retorno.push({ periodo: periodo.periodo, obrigatorias: [], optativas: [materia] })
                else
                    retorno[indexAlreadyAdded].optativas.push(materia)
            }
        }
    }

    // ate aqui todas as materias que atendem pre requisitos foram adicionadas

    for (const materia of materiasQueAtendemPreRequisitos) {

        const materiaObj = materias.find(materiaObj => materiaObj.nome === materia) as Materias

        if (materiaObj.corequisitos.length > 0) {

            let doneAll: boolean = true;
            for (const coRequisito of materiaObj.corequisitos) {
                if (!materiasFeitasSet.has(coRequisito) && !materiasPretendidasFazerSet.has(coRequisito)) {
                    doneAll = false;
                    break;
                }
            }
            if (!doneAll) {
                const indexToRemove = retorno.findIndex(retorno => retorno.obrigatorias.includes(materia))
                if (indexToRemove !== -1)
                    retorno[indexToRemove].obrigatorias = retorno[indexToRemove].obrigatorias.filter(materia => materia !== materiaObj.nome)
                else {
                    const indexToRemove = retorno.findIndex(retorno => retorno.optativas.includes(materia))
                    if (indexToRemove !== -1)
                        retorno[indexToRemove].optativas = retorno[indexToRemove].optativas.filter(materia => materia !== materiaObj.nome)
                }
                continue
            }
        }
    }

    // ate aqui todas as materias que atendem pre requisitos e corequisitos foram adicionadas

    return retorno
}