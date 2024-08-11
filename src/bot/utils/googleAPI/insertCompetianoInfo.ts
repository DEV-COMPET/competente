import { google } from "googleapis";
import { Either, left, right } from "@/api/@types/either";
import { InvalidInserirError } from "@/bot/errors/invalidInserirError";
import { env } from "@/env";
import { partial_to_full_path } from "@/bot/utils/json";

type inserirDadosInfoResponse = Either<
    {error: InvalidInserirError},
    { dadosInseridos: {
        nome: string,
        telefone: string,
        email: string,
        instagram: string | undefined,
        linkedin: string | undefined,
    } } 
>
export interface ExtractInputDataResponse {
    nome: string,
    telefone: string,
    email: string,
    instagram?: string | undefined,
    linkedin?: string | undefined,
};

export async function inserirInfoSheets({ nome, telefone, email, instagram, linkedin }: ExtractInputDataResponse): Promise<inserirDadosInfoResponse> {
    const auth = new google.auth.GoogleAuth({
        keyFile: partial_to_full_path({
            dirname: __dirname,
            partialPath: `competente.${env.ENVIRONMENT}.json`
        }),
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const sheets = google.sheets({ version: 'v4', auth});

    const spreadsheetId = '1f1QxpkcYhWNjpkWhVu4PvruvGNhzwz8tV2aRDsrYKl4';
    
    const values = [nome, telefone, email, instagram, linkedin, "ATIVO"];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            valueInputOption: 'USER_ENTERED',
            range: "Petianos Ativos",
            requestBody: {
                values: [values]
            }

        });

        return right({ dadosInseridos: {nome, telefone, email, instagram, linkedin}});
    } catch (error) {
        console.log(error);
        return left({ error: new InvalidInserirError(nome) });
    }

    
}