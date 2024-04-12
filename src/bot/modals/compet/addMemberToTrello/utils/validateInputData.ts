import { InvalidInputLinkError } from "@/bot/errors/invalidInputError"
import { ExtractInputDataResponse } from "./extractInputData"
import { Either, left, right } from "@/api/@types/either"

function validateEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateInputData({ email }: ExtractInputDataResponse): ValidateInputDataResponse {

    const invalidInputs: string[] = [];

    if(!validateEmail(email))
        invalidInputs.push("email");

    if (invalidInputs.length > 0)
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    return right({ inputData: { email } });
}

export type ValidateInputDataRightResponse = {
    email: string
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    {
        inputData: ValidateInputDataRightResponse
    }
>