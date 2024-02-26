import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"

export function validateInputData({ username }: ExtractInputDataResponse): ValidateInputDataResponse {

    const invalidInputs: string[] = [];

    if(typeof(username) !== 'string')
        invalidInputs.push("username");

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    return right({ inputData: { username } });
}

export type ValidateInputDataRightResponse = {
    username: string
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    {
        inputData: ValidateInputDataRightResponse
    }
>