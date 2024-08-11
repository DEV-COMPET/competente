import mongoose from "mongoose";

export type TalksType = {
    titulo: string
    data: Date
    youtube_link?: string
    minutos?: number
    inscritos?: string[]
    solicitacoes_certificados?: string[]
    palestrantes: string[]
    ativo: boolean
}

export class Talks implements TalksType {
    titulo: string
    data: Date
    youtube_link?: string
    minutos?: number
    inscritos?: string[]
    solicitacoes_certificados?: string[]
    palestrantes: string[]
    ativo: boolean

    constructor(certificate: TalksType) {
        this.titulo = certificate.titulo
        this.data = new Date(certificate.data)
        this.youtube_link = certificate.youtube_link
        this.palestrantes = certificate.palestrantes
        this.ativo = false
    }
}

const schema = new mongoose.Schema<TalksType>({
    titulo: { type: String, required: true },
    data: { type: Date, required: true },
    palestrantes: { type: [String], required: true },
    youtube_link: { type: String, required: false },
    minutos: { type: Number, required: false },
    inscritos: { type: [String], required: false },
    solicitacoes_certificados: { type: [String], required: false },
    ativo: { type: Boolean, required: false, default: false },
},
    {
        versionKey: false,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString()
                delete ret._id
                delete ret.__v
            }
        }
    }
)

export const TalksModel = mongoose.model<TalksType>("talks", schema)
