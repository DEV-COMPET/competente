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
        invalidInputs.push("data");

    if(!validateDate(datas))
        invalidInputs.push("data");

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    return right({ 
        datae: turnDateToString(datae),
        datas: turnDateToString(datas)
    });
}