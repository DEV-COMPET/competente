export interface ICreateCertificateProps {
    text_dir: string,
    template_dir: string,
    titulo?: string,
    data: string,
    horas: string,
    minutos?: string,
    listaNomes: string[] | string
    data_final?: string,
}

export interface ITalksProps {
    titulo: string,
    listaNomes: string[]
    horas?: string,
    minutos?: string
    data: string
}

