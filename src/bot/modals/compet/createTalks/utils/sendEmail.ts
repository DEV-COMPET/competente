import { getAllRegistrations } from "@/bot/utils/googleAPI/getCompetTalks";
import { env } from "@/env";

async function sendEmail3() {
    const registrations = await getAllRegistrations(env.GOOGLE_FORM_ID);

    if (registrations.isRight()) {
        const uniqueEmails = [...new Set(registrations.value.certificados.map(certificado => certificado.email).filter(Boolean))];
        console.dir(uniqueEmails);
    }
}