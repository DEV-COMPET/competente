import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"

export function validateInputData({ data, palestrantes, titulo }: ExtractInputDataResponse): ValidateInputDataResponse {

    if (!(titulo.includes("COMPET Talks")))
        return left({ error: new InvalidInputLinkError(["titulo"]) })

    return right({ inputData: { data, palestrantes, titulo } })
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ExtractInputDataResponse }
>