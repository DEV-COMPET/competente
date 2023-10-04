import { Either, left, right } from "@/api/@types/either";
import { AdvertidoType } from "./advertir";
import { sendMail } from "../../createTalks/utils/sendEmail";
import { GoogleError } from "@/bot/errors/googleError";
import * as fs from 'fs';
import { partial_to_full_path } from "@/bot/utils/json";

interface SendWarningEmailsToCompetianosRequest {
    advertidos: AdvertidoType[]
    motivos: string[]
}

type SendWarningEmailsToCompetianosResponse = Either<
    { error: GoogleError },
    { advertidos: AdvertidoType[] }
>

export async function sendWarningEmailsToCompetianos({ advertidos, motivos }: SendWarningEmailsToCompetianosRequest): Promise<SendWarningEmailsToCompetianosResponse> {

    advertidos.forEach(async (advertido) => {
        const titulo = `COMPET: Aviso de advertência número ${advertido.advertencias}`

        const mensagem_padrao = fs.readFileSync(partial_to_full_path({dirname: __dirname, partialPath: "./mensagem.txt"}), 'utf-8');

        const motivos_text = motivos.map(motivo => `- ${motivo}`).join('\n'); 

        const texto = mensagem_padrao
            .replace("%nome%", advertido.nome)
            .replace("%numero%", advertido.advertencias.toString())
            .replace("%motivos%", motivos_text)

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