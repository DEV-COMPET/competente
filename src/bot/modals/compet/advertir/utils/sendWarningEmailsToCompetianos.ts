import { Either, left, right } from "@/api/@types/either";
import { AdvertidoType } from "./advertir";
import { sendMail } from "../../createTalks/utils/sendEmail";
import { GoogleError } from "@/bot/errors/googleError";

interface SendWarningEmailsToCompetianosRequest {
    advertidos: AdvertidoType[]
}

type SendWarningEmailsToCompetianosResponse = Either<
    { error: GoogleError },
    { advertidos: AdvertidoType[] }
>

export async function sendWarningEmailsToCompetianos({ advertidos }: SendWarningEmailsToCompetianosRequest): Promise<SendWarningEmailsToCompetianosResponse> {

    advertidos.forEach(async (advertido) => {
        const titulo = `COMPET: Aviso de advertência número ${advertido.advertencias}`

        const texto =
            `Caro(a) ${advertido.nome},\n
            Viemos por meio deste emal abisar-lhe que você está recebendo sua advertência ${advertido.advertencias}/3.`

        const sendMailResponse = await sendMail({
            subject: titulo,
            text: texto,
            emailsTest: [advertido.email]
        })

        if (sendMailResponse.isLeft())
            return left({ error: sendMailResponse.value.error })
    })

    return right({ advertidos })
}