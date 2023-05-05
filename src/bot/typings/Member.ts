export type Member = {
  nome: string;
  data_inicio: string;
  email: string;
  membro_ativo?: boolean;
  tutor?: boolean;
  scrum_master?: boolean;
  intercambio?: boolean;
  data_fim?: string | undefined;
  lates?: string | undefined;
  linkedin?: string | undefined;
  depoimentos?: string | undefined;
  url_imagem?: string | undefined;
};
