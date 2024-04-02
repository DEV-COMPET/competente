import { InvalidInputLinkError } from "@/bot/errors/invalidInputError";
import { ExtractInputDataResponse } from "./extractInputData";
import { Either, left, right } from "@/api/@types/either";

export type ValidateInputDataRightResponse = {
    email: string,
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ValidateInputDataRightResponse }
>

export async function validateInputData({ email }: ExtractInputDataResponse) : Promise<ValidateInputDataResponse> {
    const invalidEmailsInputs: string[] = [];
    
    if ((email.includes('@'))) {
        return right({ inputData: {email: email}});
    } else {
        invalidEmailsInputs.push(email);
        return left({ error: new InvalidInputLinkError(invalidEmailsInputs)});
    }

}