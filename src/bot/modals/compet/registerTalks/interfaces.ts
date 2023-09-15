import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity"
import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { TextInputComponentData } from "discord.js"

export interface InputFieldsRequest {
    titulo: string,
    email_assinante: string,
    nome_assinante: string,
    minutos_totais: number
    link: string
}

export interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    horas: string,
    minutos: string,
    link?: string,
    email_assinante?: string
    nome_assinante?: string
    titulo: string
}

export interface createCertificatesInDatabaseRequest {
    body: CertificatesType
    interaction: ExtendedModalInteraction
}

export interface ITalksPropsExtended {
    titulo: string,
    listaNomes: string[]
    horas?: string,
    minutos?: string
    data: Date
}

export interface createCertificatesLocalAndDriveRequest {
    interaction: ExtendedModalInteraction
    input: ITalksPropsExtended
}
