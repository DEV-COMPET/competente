import { getAllRegistrations } from "@/bot/utils/googleAPI/getCompetTalks";
import { env } from "@/env";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } from "@/bot/utils/googleAPI/gmailSender.development.json"
import nodemailer from "nodemailer"
import { google } from "googleapis";
import { Either, left, right } from "@/api/@types/either";
import { GoogleError } from "@/bot/errors/googleError";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { parser } from "@/bot/utils/googleAPI/getTalksInscriptions";
import { validateEmail } from "@/api/modules/competianos/validators";

type SendMailResponse = Either<
    { error: GoogleError },
    { results: SMTPTransport.SentMessageInfo[] }
>

interface SendMailRequest {
    emailsTest: string[],
    subject: string,
    text: string,

}

export async function sendMail({ subject, text, emailsTest }: SendMailRequest): Promise<SendMailResponse> {

    const oAuth2Client = new google.auth.OAuth2({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: REDIRECT_URI
    })

    oAuth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
    })

    try {

        const { token } = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "grupo.compet@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: token as string
            }
        })
        /*
                const getEmailsResponse = await getEmails()
                if (getEmailsResponse.isLeft())
                    return left({ error: getEmailsResponse.value.error })
        */
        const emails = emailsTest // ? emailsTest : getEmailsResponse.value.emails

        const results = await Promise.all(emails.map(async (email) => {
            const mailOptions = {
                from: 'COMPET <grupo.compet@gmail.com>',
                to: `${email}`,
                subject/*: "Hello from gmail using API"*/,
                text/*: "Hello from gmail email using API"*/,
                // html: '<h1>Hello from gmail email using API</h1>'
            }

            const result = await transport.sendMail(mailOptions);
            return result;
        }));


        return right({ results })

    } catch (error) {
        console.error(error)
        return left({ error: new GoogleError("Não foi possível enviar o email.") })
    }
}

type GetEmailsResponse = Either<
    { error: GoogleError },
    { emails: string[] }
>
export async function getEmails(): Promise<GetEmailsResponse> {
    const registrations = await getAllRegistrations(env.GOOGLE_FORM_ID);
    if (registrations.isLeft()) {
        console.error(registrations.value.error);
        return left({ error: new GoogleError("Erro durante a busca dos emails no forms") });
    }

    const getEmailsFromList = (emailList: string[]): string[] => {
        return emailList
            .filter(Boolean)
            .map(email => validateEmail(email) ? email : undefined)
            .filter(email => email !== undefined)
            .map(email => email as string);
    };

    const emailsCertificado = registrations.value.certificados.map(certificado => certificado.email);
    const inscritionObjEmailList = await parser(["email"]);
    const emailsInscricao = inscritionObjEmailList.map(inscription => inscription?.email);

    const emailsTotal = [...emailsCertificado, ...emailsInscricao];

    const verifiedEmails = getEmailsFromList([...new Set(emailsTotal)]);

    return right({ emails: verifiedEmails });
}