import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"
import { env } from "@/env"
import { FetchReponseError } from "@/bot/errors/fetchReponseError"
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity"
import { InvalidInputsError } from "@/bot/errors/invalidInputsError"

export type ValidateInputDataRightResponse = {

    advertidos: {
        nome: string
        email: string
        advertencias: number
    }[],
    motivos: string[]
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ValidateInputDataRightResponse }
>

export async function validateInputData({ advertidos, motivos }: ExtractInputDataResponse): Promise<ValidateInputDataResponse> {

    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const createMemberUrl = env.ENVIRONMENT === "development" ? "http://localhost:3000/competianos" : `${env.HOST}/competianos` || "http://localhost:3000/competianos/";

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const competianos: CompetianoType[] = await response.json();

    const nomes_competianos = competianos.map((competiano) => competiano.nome);

    const nomes_multiplos = new Map<string, number>();
    const nomes_vazios = new Map<string, number>();

    const nomes_corretos = advertidos.filter(advertido => {
        const possiveis_nomes = nomes_competianos.filter(nome => nome.includes(advertido)); // nomes no DB que possivelmente são desse advertido

        if (possiveis_nomes.length === 1)
            return true;

        if (possiveis_nomes.length === 0)
            nomes_vazios.set(advertido, 0);

        if (possiveis_nomes.length > 1)
            nomes_multiplos.set(advertido, possiveis_nomes.length);

        return false;
    });

    const nomes_multiplos_string = [...nomes_multiplos]
        .map(([nome, quantidade]) => `- ${nome} (${quantidade})`)
        .join('\n') + '\n';

    const nomes_vazios_string = [...nomes_vazios]
        .map(([nome, quantidade]) => `- ${nome}`)
        .join('\n') + '\n';


    if (nomes_multiplos.size > 0 || nomes_vazios.size > 0) {
        let error_message = ""

        if (nomes_multiplos.size > 0)
            error_message += `\nOs seguintes nomes tiveram mais de uma correspondência no banco de dados:\n\n${nomes_multiplos_string}`

        if (nomes_vazios.size > 0)
            error_message += `\nOs seguintes nomes não estão presentes no banco de dados:\n\n${nomes_vazios_string}`

        return left({
            error: new InvalidInputsError(error_message)
        })
    }

    const contatos_advertidos = competianos
        .filter((competiano) => nomes_corretos.includes(competiano.nome))
        .map(({ nome, email, advertencias }) => ({ nome, email, advertencias: advertencias as number}));

    return right({ inputData: { advertidos: contatos_advertidos, motivos } })
}