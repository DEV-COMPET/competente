import { Either, left, right } from "@/api/@types/either";
import { Talks } from "@/api/modules/talks/entities/talks.entity";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { env } from "@/env";
import { ValidateInputDataRightResponse } from "./validateInputData";

type CreateTalksInDatabaseResponse = Either<
    { error: FetchReponseError },
    { createdTalks: Talks }
>

export async function createTalksInDatabase(inputData: ValidateInputDataRightResponse): Promise<CreateTalksInDatabaseResponse> {

    const requestOptions = {
        method: "post",
        body: JSON.stringify(inputData),
        headers: { "Content-Type": "application/json" },
    };

    const APIurl = env.ENVIRONMENT === "development" ? "http://localhost:3000/talks/" : `${env.HOST}/talks/` || "http://localhost:3000/talks/";

    const response = await fetch(APIurl, requestOptions);

    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const createdTalks: Talks = await response.json()

    return right({ createdTalks })

}