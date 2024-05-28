import { google } from "googleapis";
import path from "path";
import { env } from "@/env";
import { fetchDataFromSheet } from "./fetchDataFromSheet";

interface UpdateDataFromSheetRequest {
    spreadsheetId: string
    sheetName: string,
    values: string[][]
}

export async function updateSheetsDataGivenTheMemberName(nome: string) {
    const spreadsheetId = env.MEMBERS_SPREADSHEET_ID;
        
        const sheetName = "Petianos Ativos";
        const sheetData = removeBlackSpaceAndNumberFromKeys(await fetchDataFromSheet({ spreadsheetId, sheetName }));

        const size = sheetData.length
        for(let i = 0; i < size; i++) {
            if(sheetData[i].Nome === nome) {
                const key = 'STATUS';
                sheetData[i][key] = 'INATIVO';
            }
        }
        const updatedSheets = arrayObjectsToMatrix(sheetData);
        await updateSheetsData({ spreadsheetId, sheetName, values: updatedSheets });
}

export async function updateSheetsData({ spreadsheetId, sheetName, values }: UpdateDataFromSheetRequest) {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, `competente.${env.ENVIRONMENT}.json`),
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    })

    try {
        const sheets = google.sheets({ version: 'v4', auth });
        const updatedValue = await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!A1:P`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values
            }
        });

        return updatedValue.data;
    }
    catch (e) {
        console.error(e);
    }
}

interface SheetsObject {
    [key: string]: any;
  }

function arrayObjectsToMatrix(arrayOfObjects: SheetsObject[]) {
    // Extract all keys from the objects
    const keys = Object.keys(arrayOfObjects[0]);
  
    // Construct the matrix
    const matrix = [];
  
    // Add header row (keys)
    matrix.push(keys);
  
    // Add data rows
    arrayOfObjects.forEach(obj => {
      const row = keys.map(key => obj[key]);
      matrix.push(row);
    });
  
    return matrix;
  }

  function removeBlackSpaceAndNumberFromKeys(arrayOfObjects: { [key: string]: any }[]): { [key: string]: any }[] {
    const updatedArrayOfObjects: { [key: string]: any }[] = [];

    for (const obj of arrayOfObjects) {
        const updatedObject: { [key: string]: any } = {};
        for (const key in obj) {
            const newKey = key.replace(/\s\d/g, ''); // Remove black space and number from the key
            updatedObject[newKey] = obj[key];
        }
        updatedArrayOfObjects.push(updatedObject);
    }

    return updatedArrayOfObjects;
}