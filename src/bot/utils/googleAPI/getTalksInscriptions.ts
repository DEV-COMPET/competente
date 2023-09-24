import { google } from 'googleapis';
import * as fs from 'fs';
import path from 'path';
import { env } from '@/env';

async function fetchDataFromSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${env.ENVIRONMENT}.json`),
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    })

    // ID da planilha que você deseja acessar
    const spreadsheetId = '1Ji8Dc5gCvQR18y7OvNoq4rtk-CrVSNiIYCmuonKesQo';

    // Nome da folha que você deseja acessar
    const sheetName = 'Respostas ao formulário 1';

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        // Faz uma solicitação para obter os valores da planilha
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

function saveDataToJson(data: any[], fileName: string) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, jsonString, 'utf-8');
        console.log(`Os dados foram salvos em ${fileName}`);
    } catch (error) {
        console.error('Erro ao salvar os dados em JSON:', error);
    }
}

type FormData = {
    [key: string]: string[];
};

type possibleInputs = "data" | "nome_evento" | "como_ficou_sabendo" | "nome" | "email" | "tipo_aluno" | "matricula" | "curso" | "ano" | "sugestoes" | "periodo" 

function getFormData(inputs: possibleInputs[]): FormData {

    const formData: FormData = {
        data: ["Carimbo de data/hora"],
        nome_evento: ["Nome do Evento 2", "Nome do Evento 15"],
        como_ficou_sabendo: ["Como você ficou sabendo desse evento? 3"],
        nome: ["Nome 4"],
        email: ["Email: 5"],
        tipo_aluno: ["Tipo de aluno: 6"],
        matricula: ["Matrícula: 7", "Matrícula: 11"],
        curso: ["Qual curso você faz? 8", "Qual curso você faz? 12"],
        ano: ["Em que ano você está? 9"],
        sugestoes: ["Espaço reservado para sugestões 10", "Espaço reservado para sugestões 14"],
        periodo: ["Em que período você está? 13"]
    };

    const result: FormData = {};

    inputs.forEach(input => {
        if (formData[input]) {
            result[input] = formData[input];
        }
    });

    return result;
}

export async function parser(inputs: possibleInputs[]) {
    const data = await fetchDataFromSheet(); // dados totais
    const formData = getFormData(inputs);

    const retorno_list = data.map(pessoa => {
        const retorno: { [key: string]: string } = {};

        for (const key in formData) {
            const lista_linhas = formData[key];

            const linha_correta = lista_linhas
                .map(linha => pessoa[linha])
                .filter(valor => valor !== "" && valor !== undefined);

            if (linha_correta.length > 0) {
                retorno[key] = linha_correta[0];
            }
        }

        if(retorno) return retorno;
    });

    saveDataToJson(retorno_list, 'dados.json');

    return retorno_list;
}


export async function salvador() {
    const data = await fetchDataFromSheet();

    saveDataToJson(data, 'dados.json');
}
