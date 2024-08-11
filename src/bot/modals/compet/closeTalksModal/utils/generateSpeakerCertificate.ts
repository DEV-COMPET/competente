import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { createCertificadoTalksPalestrantes } from "@/bot/utils/python";
import { PythonShellError } from "python-shell";

interface GenerateSpeakerCertificateRequest {
    titulo: string
    data: Date
    minutos: number
    palestrantes: string[]
}

type GenerateSpeakerCertificateResponse = Either<
    { error: ResourceNotFoundError | PythonShellError | PythonVenvNotActivatedError | Error },
    { path_to_certificates: string }
>

export async function generateSpeakerCertificate({ titulo, data, minutos, palestrantes }: GenerateSpeakerCertificateRequest): Promise<GenerateSpeakerCertificateResponse> {

    const filePathResponse = await createCertificadoTalksPalestrantes({
        titulo, data: formatarData(data),
        listaNomes: palestrantes,
        horas: Math.trunc(minutos / 60).toString(),
        minutos: Math.trunc(minutos % 60).toString()
    });
    if (filePathResponse.isLeft())
        return left({ error: filePathResponse.value.error })

    return right({ path_to_certificates: filePathResponse.value.path_to_certificate })
}