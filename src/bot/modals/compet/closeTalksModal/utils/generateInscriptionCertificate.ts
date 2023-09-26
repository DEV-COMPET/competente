import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { parseDataFromSheet } from "@/bot/utils/googleAPI/getSheetsData";
import { createTalksPdf } from "@/bot/utils/python";
import { PythonShellError } from "python-shell";

interface GenerateInscriptionCertificateRequest {
    titulo: string
    data: Date
    minutos: number
}

type GenerateInscriptionCertificateResponse = Either<
    { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
    { path_to_certificates: string }
>

export async function generateInscriptionCertificate({ titulo, data, minutos }: GenerateInscriptionCertificateRequest): Promise<GenerateInscriptionCertificateResponse> {
    const lista_nomes_emails = await parseDataFromSheet({ sheet: 'certificado', inputs: ["nome", "nome_evento"] })

    const nomes_certificados = lista_nomes_emails
        .filter((user) => user['nome_evento'] === titulo)
        .map((user) => user['nome']);

    const filePathResponse = await createTalksPdf({
        titulo, data: formatarData(data),
        listaNomes: nomes_certificados,
        horas: Math.trunc(minutos / 60).toString(),
        minutos: Math.trunc(minutos % 60).toString()
    });
    if (filePathResponse.isLeft())
        return left({ error: filePathResponse.value.error })

    return right({ path_to_certificates: filePathResponse.value.path_to_certificates })
}