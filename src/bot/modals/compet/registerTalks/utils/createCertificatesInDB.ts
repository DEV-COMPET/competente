import { Either, left, right } from "@/api/@types/either"
import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity"
import { FetchReponseError } from "@/bot/errors/fetchReponseError"
import { InvalidDriveLinkError } from "@/bot/errors/invalidDriveLinkError"
import { validateDriveLink } from "@/bot/utils/googleAPI/updateCompetTalks"
import { env } from "@/env"

interface CreateCertificatesInDatabaseRequest {
    body: CertificatesType
}

type CreateCertificatesInDatabaseResponse = Either<
    { error: InvalidDriveLinkError },
    { sucess: boolean }
>

/**
 * @author Henrique de Paula Rodrigues
 * @description Cadastra certificados no banco de dados
 */
export async function createCertificatesInDatabase({ body }: CreateCertificatesInDatabaseRequest): Promise<CreateCertificatesInDatabaseResponse> {
    if (!validateDriveLink(body.link))
        return left({
            error: new InvalidDriveLinkError()
        })

    const url = `${env.HOST}certificados/`
    const options = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }

    // TODO: enviar email para a lista de participantes informando que o certificado está disponivel
    const response = await fetch(url, options);
    if (!(200 <= response.status && response.status < 300)) {

        const { code, message, status }: { code: number; message: string; status: number } = await response.clone().json();
        return left({
            error: new FetchReponseError({ code, status, message })
        })
    }

    return right({
        sucess: true
    })
}