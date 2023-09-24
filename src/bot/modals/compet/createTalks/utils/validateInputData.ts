import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"

export function validateInputData({ data, palestrantes, titulo }: ExtractInputDataResponse): ValidateInputDataResponse {

    const invalidInputs: string[] = []

    if (!(titulo.includes("COMPET Talks")))
        invalidInputs.push("titulo")

    const regexData = /^\d{2}-\d{2}-\d{4}$/;
    if (!(regexData.test(data)))
        invalidInputs.push("data")

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) })

    const [dia, mes, ano] = data.split('-').map(Number);

    return right({ inputData: { data: new Date(ano, mes - 1, dia), palestrantes, titulo } })
}

export type ValidateInputDataRightResponse = {
    data: Date,
    palestrantes: string[],
    titulo: string
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    {
        inputData: ValidateInputDataRightResponse
    }
>