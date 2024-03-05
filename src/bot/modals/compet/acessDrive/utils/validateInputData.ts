import { InvalidInputLinkError } from "@/bot/errors/invalidInputError";
import { ExtractInputDataResponse } from "./extractInputData";
import { Either, left, right } from "@/api/@types/either";

export type ValidateInputDataRightResponse = {
    emailsAcess: string[]
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ValidateInputDataRightResponse }
>

export async function validateInputData({ emailAcess_arr }: ExtractInputDataResponse) : Promise<ValidateInputDataResponse> {
    const invalidEmailsInputs: string[] = [];
    const validEmailsInputs: string[] = [];
    
    const emails_arr = emailAcess_arr;
    
    for (const email of emails_arr) {
        if (!(email.includes('@'))) {
            invalidEmailsInputs.push(email);
        } else {
            validEmailsInputs.push(email);
        }
    }

    if (invalidEmailsInputs.length > 0) 
        return left({ error: new InvalidInputLinkError(invalidEmailsInputs)});

    return right({ inputData: {emailsAcess: validEmailsInputs}});
}