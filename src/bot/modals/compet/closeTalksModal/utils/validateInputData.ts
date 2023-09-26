import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"
import { env } from "@/env"
import { FetchReponseError } from "@/bot/errors/fetchReponseError"
import { Talks } from "@/api/modules/talks/entities/talks.entity"

export type ValidateInputDataRightResponse = {
    talks: Talks 
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ValidateInputDataRightResponse }
>

export async function validateInputData({ titulo }: ExtractInputDataResponse): Promise<ValidateInputDataResponse> {

    const invalidInputs: string[] = []

    if (!(titulo.includes("COMPET Talks")))
        invalidInputs.push("titulo")


    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const APIurl = env.ENVIRONMENT === "development" ?
        `http://localhost:4444/talks/${titulo}` :
        `${env.HOST}/talks/${titulo}` || `http://localhost:4444/talks/${titulo}`;

    const response = await fetch(APIurl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const talks = await response.json();

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) })

    return right({ inputData: { talks } })
}