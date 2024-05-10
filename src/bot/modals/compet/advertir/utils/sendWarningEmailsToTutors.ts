import { Either, left, right } from "@/api/@types/either";
import { AdvertidoType } from "./advertir";
import { sendMail } from "../../createTalks/utils/sendEmail";
import { GoogleError } from "@/bot/errors/googleError";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { env } from "@/env";

interface SendWarningEmailsToTutorsRequest {
    advertidos: AdvertidoType[]
}

type SendWarningEmailsToTutorsResponse = Either<
    { error: GoogleError },
    { advertidos: AdvertidoType[] }
>

export async function sendWarningEmailsToTutors({ advertidos }: SendWarningEmailsToTutorsRequest): Promise<SendWarningEmailsToTutorsResponse> {

    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const createMemberUrl = env.ENVIRONMENT === "development" ? "http://localhost:3000/competianos" : `${env.HOST}/competianos` || "http://localhost:3000/competianos/";

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const competianos: CompetianoType[] = await response.json();

    const tutores = competianos
        .filter(competiano => competiano.tutor === true && competiano.membro_ativo === true)
        .map(competiano => competiano);

    tutores.forEach(async (advertido) => {
        const titulo = `COMPET: Aviso de advertência número ${advertido.advertencias}`

        const texto_adv = advertidos
            .map(advertido => `${advertido.nome}: recebeu sua advertência de número ${advertido.advertencias}`)
            .join('\n');

        const texto =
            `Caro(a) ${advertido.nome},\n
            Viemos por meio deste emal avisar-lhe sobre a(s) seguinte(s) advertência(s) dada(s) a(os) seguinte(s) competiano(s): 
            
            ${texto_adv}
            `

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