interface AutentiqueVisualizado {
  created: string;
  motivo: string | null;
  ipv4: string;
  geotrack: {
    country: string;
    countryISO: string;
    state: string | null;
    stateISO: string | null;
    city: string | null;
    zipcode: string | null;
    latitude: number;
    longitude: number;
  };
}

interface AutentiqueMail {
  sent: boolean | string;
  opened: boolean | string | null;
  refused: boolean | string | null;
  delivered: boolean | string | null;
  reason: string | null;
}

interface AutentiqueParte {
  nome: string | null;
  email: string;
  cpf: string | null;
  nascimento: string | null;
  empresa: string | null;
  funcao: string;
  visualizado: AutentiqueVisualizado | {};
  assinado: object;
  rejeitado: object;
  mail: AutentiqueMail;
}

interface AutentiqueDocumento {
  uuid: string;
  nome: string;
  rejeitavel: boolean;
  created: string;
  updated: string;
  assinatura: string;
  publicado: string;
  disponivel: boolean;
}

interface AutentiqueRemetente {
  nome: string;
  empresa: string;
  email: string;
  cpf: string;
  nascimento: string;
}

interface AutentiqueArquivo {
  original: string;
  assinado: string;
}

export interface AutentiqueApiResponse {
  partes: AutentiqueParte[];
  documento: AutentiqueDocumento;
  remetente: AutentiqueRemetente;
  arquivo: AutentiqueArquivo;
}
