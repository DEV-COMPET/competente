import { InvalidInputLinkError } from "@/bot/errors/invalidInputError";
import { ExtractInputDataResponse } from "./extractInputData";
import { Either, left, right } from "@/api/@types/either";

export type ValidateInputDataRightResponse = {
    emailsInvite: string[]
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ValidateInputDataRightResponse }
>

export async function validateInputData({ emailsInvite }: ExtractInputDataResponse) : Promise<ValidateInputDataResponse> {
    const invalidEmailsInputs: string[] = [];
    const validEmailsInputs: string[] = [];
    
    const emails_arr = emailsInvite.split(';');
    
    for (const email of emails_arr) {
        if (!(email.includes('@'))) {
            invalidEmailsInputs.push(email);
        } else {
            validEmailsInputs.push(email);
        }
    }

    if (invalidEmailsInputs.length > 0) 
        return left({ error: new InvalidInputLinkError(invalidEmailsInputs)});

    return right({ inputData: {emailsInvite: validEmailsInputs}});
}