import { Either, left, right } from "@/api/@types/either";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";

export type AdvertidoType = {
    nome: string; email: string, advertencias: number
}

interface AdvertirRequest {
    advertidos: AdvertidoType[]
}

type AdvertirResponse = Either<
    { error: FetchReponseError },
    { advertidos: AdvertidoType[] }
>

export async function advertir({ advertidos }: AdvertirRequest): Promise<AdvertirResponse> {

    advertidos.forEach(async (advertido) => {

        advertido.advertencias += 1

        const requestOptions = {
            method: "put",
            body: JSON.stringify({ advertencias: advertido.advertencias }),
            headers: { "Content-Type": "application/json" },
        };

        const createMemberUrl = `http://localhost:3000/competianos/${advertido.nome}`

        const response1 = await fetch(createMemberUrl, requestOptions);
        if (!(response1.status >= 200 && response1.status < 300)) {
            const { code, message, status }: { code: number; message: string; status: number } = await response1.json();
            return left({ error: new FetchReponseError({ code, message, status }) })
        }

        console.log(advertido.nome + " advertido")

        return advertido
    })

    return right({ advertidos })
}