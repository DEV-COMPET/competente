import { ExtractInputDataResponse } from "./extractInputData"
import { validateDate} from "./utils"
import { left, right, Either } from "@/api/@types/either"
import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { turnDateToString,} from "./utils"

type ValidateInputDataResponse = Either<
    { error : InvalidInputLinkError },
    { 
        datae: string
        datas: string
     }
>

export function validateInputData({ datae, datas }: ExtractInputDataResponse): ValidateInputDataResponse {

    const invalidInputs: string[] = [];

    if(!validateDate(datae))
        invalidInputs.push("Data de entrada inválida");

    if(!validateDate(datas))
        invalidInputs.push("Data de saída inválida");

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    // Parse dates
    const dateEntrada = new Date(datae);
    const dateSaida = new Date(datas);

    // Check if datae is greater than datas
    if (dateEntrada > dateSaida)
        invalidInputs.push("A data de entrada deve ser menor ou igual a data de saída");

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    return right({ 
        datae: turnDateToString(datae),
        datas: turnDateToString(datas)
    });
}