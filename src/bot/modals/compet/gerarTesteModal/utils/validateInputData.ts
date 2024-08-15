import { ExtractInputDataResponse } from "./extractInputData"
import { validateDate, validateMinutes, validateName } from "./utils"
import { left, right, Either } from "@/api/@types/either"
import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { turnDateToString, minutesToString, getFormattedName } from "./utils"

type ValidateInputDataResponse = Either<
    { error : InvalidInputLinkError },
    { 
        data: string
        minutos_totais: string
        titulo: string
        nome: string
     }
>

export function validateInputData({ data, minutos_totais, titulo, nome }: ExtractInputDataResponse): ValidateInputDataResponse {

    const invalidInputs: string[] = [];

    if(!validateDate(data))
        invalidInputs.push("data");

    if(!validateMinutes(minutos_totais))
        invalidInputs.push("minutos")

    if(!validateName(nome))
        invalidInputs.push("nome")

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    return right({ 
        data: turnDateToString(data),
        minutos_totais: minutesToString(parseInt(minutos_totais, 10)),
        nome: getFormattedName(nome),
        titulo
    });
}