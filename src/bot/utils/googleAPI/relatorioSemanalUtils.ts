import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "competente.development.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Função para calcular o intervalo da semana (quinta → quarta)
function obterIntervaloSemana(): string {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 (domingo) ... 6 (sábado)
  
  // Calcular quantos dias voltar para chegar na quinta-feira anterior
  let diasParaQuinta: number;
  if (diaSemana === 0) { // domingo
    diasParaQuinta = 3;
  } else if (diaSemana === 1) { // segunda
    diasParaQuinta = 4;
  } else if (diaSemana === 2) { // terça
    diasParaQuinta = 5;
  } else if (diaSemana === 3) { // quarta
    diasParaQuinta = 6;
  } else if (diaSemana === 4) { // quinta
    diasParaQuinta = 0;
  } else if (diaSemana === 5) { // sexta
    diasParaQuinta = 1;
  } else { // sábado
    diasParaQuinta = 2;
  }

  const quinta = new Date(hoje);
  quinta.setDate(hoje.getDate() - diasParaQuinta);

  const quarta = new Date(quinta);
  quarta.setDate(quinta.getDate() + 6);

  const formata = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  return `${formata(quinta)} a ${formata(quarta)}`;
}

export async function registrarRelatorioNaPlanilha(
  usuario: string,
  texto: string
) {
  const spreadsheetId = "1On-4KuCzsgk0cEPuSbiOonoDmChMkErQ9Ss5ASwHztQ";
  const aba = usuario;

  try {
    // 1. Garantir que a aba existe
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const abaExiste = meta.data.sheets?.some(
      (s) => s.properties?.title === aba
    );

    if (!abaExiste) {
      console.log(`Criando nova aba para o usuário: ${aba}`);
      const addSheetResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: { 
                properties: { 
                  title: aba 
                } 
              },
            },
          ],
        },
      });

      // Adicionar cabeçalhos na nova aba
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${aba}!A1:K1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["Semana", "Relatório 1", "Relatório 2", "Relatório 3", "Relatório 4", "Relatório 5", "Relatório 6", "Relatório 7", "Relatório 8", "Relatório 9", "Relatório 10"]],
        },
      });

      // Formatar cabeçalhos e configurar ajuste de texto
      const sheetId = addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;
      if (sheetId !== undefined) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              // Formatar cabeçalhos
              {
                repeatCell: {
                  range: {
                    sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 11 // A até K (11 colunas)
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.2, green: 0.6, blue: 1 }, // Azul
                      textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      horizontalAlignment: "CENTER",
                      wrapStrategy: "WRAP" // Quebra automática de linha
                    }
                  },
                  fields: "userEnteredFormat"
                }
              },
              // Configurar ajuste de texto para colunas de relatório
              {
                repeatCell: {
                  range: {
                    sheetId,
                    startRowIndex: 1, // A partir da linha 2
                    endRowIndex: 1000, // Até linha 1000
                    startColumnIndex: 1, // Coluna B (Relatório 1)
                    endColumnIndex: 11   // Até coluna K (Relatório 10)
                  },
                  cell: {
                    userEnteredFormat: {
                      wrapStrategy: "WRAP", // Quebra automática de linha
                      verticalAlignment: "TOP", // Alinha texto no topo da célula
                      horizontalAlignment: "LEFT", // Alinha texto à esquerda
                      textFormat: {
                        fontSize: 10, // Fonte menor para mais texto por linha
                        fontFamily: "Arial"
                      }
                    }
                  },
                  fields: "userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment,userEnteredFormat.horizontalAlignment,userEnteredFormat.textFormat"
                }
              },
              
              // Configurar altura automática das linhas
              {
                updateDimensionProperties: {
                  range: {
                    sheetId,
                    dimension: "ROWS",
                    startIndex: 1, // A partir da linha 2
                    endIndex: 1000 // Até linha 1000
                  },
                  properties: {
                    pixelSize: 80 // Altura mínima maior para acomodar mais linhas de texto
                  },
                  fields: "pixelSize"
                }
              },
              // Ajustar largura das colunas
              {
                updateDimensionProperties: {
                  range: {
                    sheetId,
                    dimension: "COLUMNS",
                    startIndex: 0, // Coluna A
                    endIndex: 1    // Coluna A
                  },
                  properties: {
                    pixelSize: 120 // Largura da coluna Semana
                  },
                  fields: "pixelSize"
                }
              },
              {
                updateDimensionProperties: {
                  range: {
                    sheetId,
                    dimension: "COLUMNS",
                    startIndex: 1, // Coluna B
                    endIndex: 11    // Até coluna K
                  },
                  properties: {
                    pixelSize: 180 // Largura otimizada para quebra de linha natural
                  },
                  fields: "pixelSize"
                }
              },
              // Configurar altura automática baseada no conteúdo
              {
                autoResizeDimensions: {
                  dimensions: {
                    sheetId,
                    dimension: "ROWS",
                    startIndex: 1,
                    endIndex: 1000
                  }
                }
              }
            ]
          }
        });
      }
    }

    // 2. Ler linhas da aba (expandido para mais colunas)
    const range = `${aba}!A:K`;
    const resposta = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values: string[][] = resposta.data.values || [];
    const semana = obterIntervaloSemana();
    
    console.log(`Registrando relatório para semana: ${semana}`);
    console.log(`Usuário: ${usuario}`);
    //console.log(`Dados existentes na planilha:`, values);

    // 3. Procurar se já existe uma linha para esta semana
    let linhaIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i] && values[i][0] === semana) {
        linhaIndex = i;
        break;
      }
    }

    let targetRow: number;
    let updateRange: string;
    let valuesToUpdate: string[][];

    if (linhaIndex >= 0) {
      // Existe registro para esta semana - encontrar próxima coluna disponível
      targetRow = linhaIndex + 1;
      const linhaExistente = values[linhaIndex];
      
      // Procurar a primeira coluna vazia (de B até K = índices 1 até 10)
      let colunaDisponivel = -1;
      for (let col = 1; col <= 10; col++) {
        if (!linhaExistente[col] || linhaExistente[col].trim() === "") {
          colunaDisponivel = col;
          break;
        }
      }
      
      if (colunaDisponivel !== -1) {
        // Encontrou coluna disponível na linha existente
        const colLetter = String.fromCharCode(65 + colunaDisponivel); // B=66, C=67, etc.
        updateRange = `${aba}!${colLetter}${targetRow}:${colLetter}${targetRow}`;
        valuesToUpdate = [[texto]];
        //console.log(`Entrada ${colunaDisponivel} da semana na linha: ${targetRow}, coluna: ${colLetter}`);
      } else {
        // Todas as 10 colunas estão ocupadas, criar nova linha
        targetRow = values.length + 1;
        updateRange = `${aba}!A${targetRow}:B${targetRow}`;
        valuesToUpdate = [[semana, texto]];
        //console.log(`Todas as colunas ocupadas, criando nova linha: ${targetRow}`);
      }
    } else {
      // Nova semana - criar nova linha
      targetRow = values.length + 1;
      updateRange = `${aba}!A${targetRow}:B${targetRow}`;
      valuesToUpdate = [[semana, texto]];
      //console.log(`Nova semana na linha: ${targetRow}`);
    }

    //console.log(`Range de atualização: ${updateRange}`);
    //console.log(`Valores a inserir:`, valuesToUpdate);

    const updateResult = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "RAW",
      requestBody: {
        values: valuesToUpdate,
      },
    });

    // Aplicar formatação específica à célula que acabou de ser atualizada
    if (updateRange.includes(':')) {
      const [startCell] = updateRange.split(':');
      const match = startCell.match(/([A-Z]+)(\d+)/);
      if (match) {
        const column = match[1];
        const row = parseInt(match[2]);
        
        // Obter informações da planilha para aplicar formatação
        const sheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
        const sheet = sheetInfo.data.sheets?.find(s => s.properties?.title === aba);
        const sheetId = sheet?.properties?.sheetId;
        
        if (sheetId !== undefined && column !== 'A') { // Não formatar coluna A (Semana)
          const colIndex = column.charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
          
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  repeatCell: {
                    range: {
                      sheetId,
                      startRowIndex: row - 1,
                      endRowIndex: row,
                      startColumnIndex: colIndex,
                      endColumnIndex: colIndex + 1
                    },
                    cell: {
                      userEnteredFormat: {
                        wrapStrategy: "WRAP",
                        verticalAlignment: "TOP",
                        horizontalAlignment: "LEFT",
                        textFormat: {
                          fontSize: 9,
                          fontFamily: "Arial"
                        }
                      }
                    },
                    fields: "userEnteredFormat"
                  }
                }
              ]
            }
          });
        }
      }
    }

    updateResult.data;
    console.log(`✅ Relatório registrado com sucesso na planilha!`);

  } catch (error) {
    console.error("❌ Erro ao registrar relatório na planilha:", error);
    throw error; // Re-lança o erro para ser capturado no modal
  }
}
