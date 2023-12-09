import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";

interface ExtractDataRequest {
    competianos: CompetianoType[]
}

interface ExtractDataResponse {
    quantidadeMembrosAtuais: string
    quantidadeExMembros: string
    quantidadeTutoresAtuais: string
    quantidadeExTutores: string
    quantidadeMembrosComIntercambio: string
    quantidadeExMembrosComIntercambio: string
    quantidadeScrumMasters: string
    tempoMedioPermanencia: string
    maiorTempo: string
    menorTempo: string
}

function getDateDifference(date1: Date, date2: Date) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    const millisecondsInDay = 1000 * 3600 * 24;
    const daysDifference = Math.floor(timeDiff / millisecondsInDay);

    const yearsDifference = Math.floor(daysDifference / 365);
    const monthsDifference = Math.floor((daysDifference - (yearsDifference * 365)) / 30);
    const daysLeft = Math.floor(daysDifference - (yearsDifference * 365) - (monthsDifference * 30));

    return {
        days: daysLeft,
        months: monthsDifference,
        years: yearsDifference,
        asDate: new Date(0, 0, daysDifference) // Creating a Date object based on days difference only
    };
}

function daysIntoDate(days: number) {
    const years = Math.floor(days / 365);
    const months = Math.floor((days - (years * 365)) / 30);
    const daysLeft = Math.floor(days - (years * 365) - (months * 30));

    console.dir({ years, months, daysLeft })

    const formatedDate = 
        `${years > 0 ? `${years} ano${years > 1 ? 's' : ""}` : ''} ${months > 0 ? `${months} mes${months > 1 ? 'es' : ""}` : ''} ${daysLeft > 0 ? `${daysLeft} dia${daysLeft > 1 ? 's' : ""}` : ''}`

    return formatedDate
}

export function extractData({ competianos }: ExtractDataRequest): ExtractDataResponse {

    const quantidadeMembrosAtuais = competianos
        .filter(competiano => competiano.membro_ativo)
        .length
        .toString()

    const quantidadeExMembros = competianos
        .filter(competiano => !competiano.membro_ativo)
        .length
        .toString()

    const quantidadeTutoresAtuais = competianos
        .filter(competiano => competiano.tutor)
        .filter(competiano => competiano.membro_ativo)
        .length
        .toString()

    const quantidadeExTutores = competianos
        .filter(competiano => competiano.tutor)
        .filter(competiano => !competiano.membro_ativo)
        .length
        .toString()

    const quantidadeMembrosComIntercambio = competianos
        .filter(competiano => competiano.intercambio)
        .filter(competiano => competiano.membro_ativo)
        .length
        .toString()

    const quantidadeExMembrosComIntercambio = competianos
        .filter(competiano => competiano.intercambio)
        .filter(competiano => !competiano.membro_ativo)
        .length
        .toString()

    const quantidadeScrumMasters = competianos
        .filter(competiano => competiano.scrum_master)
        .length
        .toString()

    const tempoPermanenciaGeral = competianos
        .filter(competiano => !competiano.membro_ativo)
        .filter(competiano => {

            const dataFim = competiano.data_fim ? new Date(competiano.data_fim).getFullYear() : 1899
            const dataInicio = new Date(competiano.data_inicio).getFullYear()

            return dataFim >= dataInicio;
        }).map(competiano => {
            const dataInicio = new Date(competiano.data_inicio!)
            const dataFim = new Date(competiano.data_fim!)
            const { days, months, years } = getDateDifference(dataInicio, dataFim)

            return `${years} ${months} ${days} ${competiano.nome}`
        })

    const tempoMedioPermanencia = daysIntoDate(tempoPermanenciaGeral
        .reduce((total, tempo) => {
            const [years, months, days] = tempo.split(' ').map(part => parseInt(part));
            const totalDays = (years * 365) + (months * 30) + days;
            return total + totalDays;
        }, 0) / tempoPermanenciaGeral.length
    )

    let maior = Number.MIN_SAFE_INTEGER;
    let maiorTempo = ""

    tempoPermanenciaGeral
        .forEach(tempo => {
            const [years, months, days, ...nomeParts] = tempo.split(' ');
            const nome = nomeParts.join(' ');
            const yearsInt = parseInt(years);
            const monthsInt = parseInt(months);
            const daysInt = parseInt(days);
            const totalDays = (yearsInt * 365) + (monthsInt * 30) + daysInt;
            if (totalDays > maior) {
                maior = totalDays;
                maiorTempo = `${daysIntoDate(totalDays)} (${nome})`;
            }
        })

    let menor = Number.MAX_SAFE_INTEGER;
    let menorTempo = ""

    tempoPermanenciaGeral
        .forEach(tempo => {
            const [years, months, days, ...nomeParts] = tempo.split(' ');
            console.dir({ years, months, days, nomeParts })
            const nome = nomeParts.join(' ');
            const yearsInt = parseInt(years);
            const monthsInt = parseInt(months);
            const daysInt = parseInt(days);
            console.dir({ yearsInt, monthsInt, daysInt })

            const totalDays = (yearsInt * 365) + (monthsInt * 30) + daysInt;
            if (totalDays < menor) {
                menor = totalDays;
                menorTempo = `${daysIntoDate(totalDays)} (${nome})`;
            }
        })

    return {
        quantidadeMembrosAtuais,
        quantidadeExMembros,
        quantidadeTutoresAtuais,
        quantidadeExTutores,
        quantidadeMembrosComIntercambio,
        quantidadeExMembrosComIntercambio,
        quantidadeScrumMasters,
        tempoMedioPermanencia,
        maiorTempo,
        menorTempo,

    };
}
