import 'dotenv/config'; 
import { z } from 'zod'; 

const envSchema = z.object({

    DISCORD_GUILD_ID: z.string(),
    DISCORD_PUBLIC_KEY: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    ENVIRONMENT: z.enum(["development" , "production" , "debug"]).default("development"),
    GOOGLE_FORM_ID: z.string(),
    GOOGLE_FORM_INSCRICAO_ID: z.string(),
    GOOGLE_DRIVE_FOLDER_ID: z.string(),
    AUTENTIQUE_TOKEN: z.string(),
    AUTENTIQUE_URL: z.string(),
    HOST: z.string().default("http://localhost:3000"),
    MONGODB_USER: z.string().optional(),
    MONGODB_PASSWORD: z.string().optional(),
    PORT: z.coerce.number().default(3000),
    TRELLO_BOARD_ID: z.string(),
    TRELLO_DEV_BOARD_ID: z.string(),
    TRELLO_ADM_BOARD_ID: z.string(),
    TRELLO_EVENTOS_BOARD_ID: z.string(),
    TRELLO_MARKETING_BOARD_ID: z.string(),
    TRELLO_API_KEY: z.string(),
    TRELLO_ACCOUNT_TOKEN: z.string(),
    MEMBERS_SPREADSHEET_ID: z.string()
});

const _env = envSchema.safeParse(process.env); // tenta validar process.env para ver se tem as exatas informações dentro

if (_env.success === false) {
    console.error('Invalid environment variables',
        _env.error.format()); // formata todos os erros ali

    throw new Error('Invalid environment variables'); 
}

console.log("Environment Variables: valid")

export const env = _env.data

