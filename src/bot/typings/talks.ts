export interface FormResponseTalks {
    nome: string;
    email: string;
    event: string;
    matricula: string;
    createTime: string;
}
export enum FormInput{
    EVENTO="459eff55",
    NOME = "5449dcbb",
    EMAIL = "69f30e2c",
    MATRICULA = "3ee1b434"
}
export enum FormItemsId{
    NOME = "4c2c8a48",
    EMAIL = "2b605265",
    MATRICULA = "4d4dad1f",
    EVENTO = "2d282a40",
    ALERTA = "438ea020",
    AGRADECIMENTO = "3a7b1f93"
}
export interface Aluno {
    matricula: string;
    email: string;
    nome: string;

}
export enum CertificatePositionAssign{
    eixoX="73",
    eixoY="70"
}