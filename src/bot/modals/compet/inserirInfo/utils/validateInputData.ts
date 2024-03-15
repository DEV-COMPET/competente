import { InvalidInputLinkError } from "@/bot/errors/invalidInputError";
import { ExtractInputDataResponse } from "./extractInputData";
import { Either, left, right } from "@/api/@types/either";
import { Url } from "url";

export function validateInputData({ nome, telefone, email, instagram, linkedin }: ExtractInputDataResponse): ValidateInputDataResponse {
    const invalidInputs: string[] = [];

    if (!telefone.includes("("))
        invalidInputs.push(telefone);

    if (!email.includes("@"))
        invalidInputs.push(email);

    if (instagram)
        if (!instagram.includes("https://www.instagram.com/"))
            invalidInputs.push(instagram);
    
    if (linkedin)
        if (!linkedin.includes("https://www.linkedin.com/in/"))
            invalidInputs.push(linkedin);

    if (invalidInputs.length > 0) 
        return left({ error: new InvalidInputLinkError(invalidInputs) });

    return right({ inputData: { nome, telefone, email, instagram, linkedin } });
}

export type ValidateInputDataRightResponse = {
    nome: string,
    telefone: string,
    email: string,
    instagram: string | undefined,
    linkedin: string | undefined
};

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ValidateInputDataRightResponse }
>