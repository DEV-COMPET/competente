import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

// Your iLovePDF credentials
const publicKey = 'project_public_a79620feab29a44430103674a7505317_PQqZ0b178d595859d5851cff36e3fa33456e4';
const secretKey = 'your_secret_key';

// Function to get JWT token
async function getAuthToken() {
  const authUrl = 'https://api.ilovepdf.com/v1/auth';
  try {
    const response = await axios.post(authUrl, { public_key: publicKey });
    return response.data.token;
  } catch (error) {
    console.error('Error getting JWT token:', (error as any).response?.data || (error as any).message);
    throw error;
  }
}

export async function compressPDF(inputPath: string, outputPath: string) {
  try {
    const token = await getAuthToken();
    console.log("tokeeeeeeeeeen: ", token);

    const startUrl = `https://api.ilovepdf.com/v1/start/compress`;
    const startResponse = await axios.get(startUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const taskId = startResponse.data.task;
    const server = startResponse.data.server;

    console.log('Start Response Data:', JSON.stringify(startResponse.data, null, 2));
    console.log(inputPath)

    const uploadUrl = `https://${server}/v1/upload`;
    const form = new FormData();
    form.append('task', taskId);
    form.append('file', fs.createReadStream(inputPath));

    await axios.post(uploadUrl, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    });

    console.log('File uploaded successfully.');

    const processUrl = `https://${server}/v1/process`;
    await axios.post(processUrl, { task: taskId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('File processed successfully.');

    const downloadUrl = `https://${server}/v1/download/${taskId}`;
    const downloadResponse = await axios.get(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'stream',
    });

    downloadResponse.data.pipe(fs.createWriteStream(outputPath));
    console.log(`Compressed file saved to ${outputPath}`);

  } catch (error: any) {
    console.error('Error during PDF compression:', error.response ? error.response.data : error.message);
  }
}