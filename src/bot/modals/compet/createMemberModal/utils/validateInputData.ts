import { env } from "@/env";
import { ExtractInputDataResponse } from "./extractInputData";
import { Either, left, right } from "@/api/@types/either";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { Member } from "@/bot/typings/Member";

export type ValidateInputDataRightResponse = {
    competiano: Member
}

type ValidateInputDataResponse = Either<
    { error: FetchReponseError },
    { inputData: ValidateInputDataRightResponse }
>

export async function validateInputData({ inputData }: ExtractInputDataResponse): Promise<ValidateInputDataResponse> {
    const requestOptions = {
        method: "post",
        body: JSON.stringify(inputData),
        headers: { "Content-Type": "application/json" },
    };

    const APIUrl = env.ENVIRONMENT === "development" ? "http://localhost:3000/competianos" : `${env.HOST}/competianos` || "http://localhost:3000/competianos/";

    const response = await fetch(APIUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    return right({ inputData: { competiano: await response.json() } })
}