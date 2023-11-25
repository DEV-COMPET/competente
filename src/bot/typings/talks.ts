export interface FormResponseTalks {
  nome: string;
  email: string;
  event: string;
  matricula: string;
  createTime: string;
}
export enum FormInput {
  EVENTO = "459eff55",
  NOME = "5449dcbb",
  EMAIL = "69f30e2c",
  MATRICULA = "3ee1b434",
  RELEVANCIA_TEMA = "71160225",
  CHANCE_INDICAR = "15086fcb",
  CORRESPONDENCIA_EXPECTATIVAS = "0e4af06f",
  NIVEL_SATISFACAO = "1b4928e1",
  NOTA_ORGANIZACAO = "7e428446",
  SUGESTAO1 = "5677c058",
  SUGESTAO2 = "0dea6769"
}

export enum FormInputRegistration {
  EVENTO1 = "5ae17d18",
  EVENTO2 = "459eff55",
  NOME = "2780a2f6",
  EMAIL = "0c736e90",
  MATRICULA = "7c7a5e78",
}

export enum FormItemsId {
  NOME = "4c2c8a48",
  EMAIL = "2b605265",
  MATRICULA = "4d4dad1f",
  EVENTO = "2d282a40",
  ALERTA = "438ea020",
  AGRADECIMENTO = "3a7b1f93",
}
export interface Aluno {
  matricula: string;
  email: string;
  nome: string;
}
export enum CertificatePositionAssign {
  eixoX = "73",
  eixoY = "70",
}
