
interface ListPossibleSheetDataRequest {
    choice: 'inscricao' | 'certificados'
}

export async function listPossibleSheetData({ choice }: ListPossibleSheetDataRequest) {

    const possibleInputsArray: string[] = choice === 'certificados'
    ? ["data", "nome_evento", "nome", "email", "matricula"]
    : ["data", "nome_evento", "nome", "email", "matricula", "como_ficou_sabendo", "tipo_aluno", "curso", "ano", "sugestoes", "periodo"];
  

    return possibleInputsArray;
}