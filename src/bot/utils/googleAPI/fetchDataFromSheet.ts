import { google } from "googleapis";
import path from "path";
import { env } from "@/env";
import { readJsonFile } from "../json";

interface FetchDataFromSheetRequest {
    spreadsheetId: string
    sheetName: string
}

export async function fetchDataFromSheet({ spreadsheetId, sheetName }: FetchDataFromSheetRequest) {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${env.ENVIRONMENT}.json`),
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    })

    try {

        const js = readJsonFile({dirname: __dirname, partialPath: `competente.${env.ENVIRONMENT}.json`})

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A1:P`, // Substitua pela faixa que deseja ler
        });

        const values = response.data.values;

        if (!values || values.length === 0) {
            console.log('Nenhum dado encontrado na planilha.');
            return [];
        }

        const headers = values[0];

        const rows = values.slice(1);

        // Mapeia os dados para objetos
        const objects = rows.map((row) => {
            const obj: { [key: string]: string } = {};
            headers.forEach((header, index) => {
                // Adicione um sufixo ao nome da coluna para torná-lo exclusivo
                const columnName = header + (index > 0 ? ` ${index + 1}` : '');
                obj[columnName] = row[index] || '';
            });
            return obj;
        });

        return objects;
    } catch (error) {
        console.error('Erro ao acessar a planilha:', error);
        return [];
    }
}