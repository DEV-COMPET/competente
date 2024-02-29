import { Either, left, right } from "@/api/@types/either";
import { sendMail } from "../../createTalks/utils/sendEmail";
import { GoogleError } from "@/bot/errors/googleError";
import * as fs from 'fs';
import { partial_to_full_path } from "@/bot/utils/json";
import { Invite } from "discord.js";

interface sendEmailViaEmailRequest {
    emailVerificado: string[]; 
    invite: Invite
}

type sendEmailViaEmailResponse = Either<
    { error: GoogleError },
    { emailVerificado: string[] }
>

export async function sendInviteViaEmail ({ emailVerificado, invite}: sendEmailViaEmailRequest): Promise<sendEmailViaEmailResponse> {
    const titulo = "Convite para entrar no server do Compet"

    const mensagem_padrao = fs.readFileSync(partial_to_full_path({ dirname: __dirname, partialPath: "./mensagem.txt"}), 'utf-8');

    
    const texto = mensagem_padrao
        .replace("%invite%", invite.url)

    const sendMailResponse = await sendMail({
        subject: titulo,
        text: texto,
        emailsTest: [emailVerificado.join(";")]
    })

    if (sendMailResponse.isLeft())
        return left ({error: sendMailResponse.value.error})

    return right ({ emailVerificado });
}