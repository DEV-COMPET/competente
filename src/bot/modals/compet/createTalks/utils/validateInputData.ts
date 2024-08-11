import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"

export function validateInputData({ data, palestrantes, titulo, hora }: ExtractInputDataResponse): ValidateInputDataResponse {

    const invalidInputs: string[] = []

    if (!(titulo.includes("COMPET Talks")))
        invalidInputs.push("titulo")

    const regexData = /^\d{2}-\d{2}-\d{4}$/;
    if (!(regexData.test(data)))
        invalidInputs.push("data")

    const regexHora = /^\d{2}:\d{2}$/;
    if (!(regexHora.test(hora)))
        invalidInputs.push("hora")

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) })

    const [dia, mes, ano] = data.split('-').map(Number);
    const [horas, minutos] = hora.split(':').map(Number)

    return right({ inputData: { data: new Date(ano, mes - 1, dia, horas, minutos), palestrantes, titulo } })
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