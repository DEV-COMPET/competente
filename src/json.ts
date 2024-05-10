import 'dotenv/config'; 
import { saveDataToJson } from './bot/utils/json';

const COMPETENTE_DEVELOPMENT_JSON = process.env.COMPETENTE_DEVELOPMENT_JSON as string
const GMAIL_SENDER_JSON = process.env.GMAIL_SENDER_JSON as string

function copyJsonFiles(): void {

    const competenteDevelopment = JSON.parse(COMPETENTE_DEVELOPMENT_JSON)
    const gmailSender = JSON.parse(GMAIL_SENDER_JSON)

    saveDataToJson(competenteDevelopment, 'src/bot/utils/googleAPI/competente.development.json')
    saveDataToJson(gmailSender, 'src/bot/utils/googleAPI/gmailSender.development.json')

}

copyJsonFiles()