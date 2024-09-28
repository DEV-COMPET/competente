import { gql } from "graphql-tag";
import FormData from "form-data";
import fs from "fs";
import {
  ActionEnum,
  DeliveryMethodEnum,
  DocumentInput,
  FooterEnum,
  PositionElementEnum,
  PositionInput,
  SignatureAppearanceEnum,
  SignerInput,
} from "./graphql/resolvers-types";
import { AwesomeGraphQLClient } from "awesome-graphql-client";
import { DocumentNode, print } from "graphql";
import { CertificatePositionAssign as TalksCertificatePositionAssign } from "../../typings/talks";
import { env } from "@/env";
import { RequestInfo, RequestInit } from 'node-fetch';
import { CertificatePositionAssign as CompletionCertificatePositionAssign } from "@/bot/typings/CompletionCertificate";
import { getNumberOfPages } from "../pdf/getNumberOfPages";

const nodeFetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

const API_URL = env.AUTENTIQUE_URL;
const authToken = env.AUTENTIQUE_TOKEN;
interface CreateDocumentProps {
  filePath: string;
  numPages: number;
  signers: SignerInput[];
  document: DocumentInput;
}
type Signer = {
  name: string;
  email: string;
};
interface InterfaceSubmitToAutentiqueProps {
  numPages: number;
  titulo: string;
  signer: Signer;
  filePath: string;
  startPage: number;
  x: string;
  y: string;
}

interface GenericSubmitToAutentiqueInterface {
  titulo: string;
  signer: Signer;
  filePath: string;
}

const client = new AwesomeGraphQLClient({
  endpoint: API_URL,
  fetch: nodeFetch,
  FormData,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  },
  formatQuery: (query: DocumentNode | string) =>
    typeof query === "string" ? query : print(query),
});
// Essa mutation é usada para criar um documento no autentique no modo desenvolvimento
const CREATE_DOCUMENT_MUTATION_DEVELOPMENT = gql`
  mutation CreateDocumentMutation(
    $document: DocumentInput!
    $signers: [SignerInput!]!
    $file: Upload!
  ) {
    createDocument(
      sandbox: true
      document: $document
      signers: $signers
      file: $file
    ) {
      id
      name
      refusable
      sortable
      created_at
      signatures {
        public_id
        name
        email
        created_at
        action {
          name
        }
        link {
          short_link
        }
        user {
          id
          name
          email
        }
      }
    }
  }
`;
const CREATE_DOCUMENT_MUTATION_PRODUCTION = gql`
  mutation CreateDocumentMutation(
    $document: DocumentInput!
    $signers: [SignerInput!]!
    $file: Upload!
  ) {
    createDocument(
      sandbox: false
      document: $document
      signers: $signers
      file: $file
    ) {
      id
      name
      refusable
      sortable
      created_at
      signatures {
        public_id
        name
        email
        created_at
        action {
          name
        }
        link {
          short_link
        }
        user {
          id
          name
          email
        }
      }
    }
  }
`;
const mutations = {
  development: CREATE_DOCUMENT_MUTATION_DEVELOPMENT,
  production: CREATE_DOCUMENT_MUTATION_PRODUCTION,
};

function setupAssignPositions(numPages: number, x: string, y: string, startPage: number = 1): PositionInput[] {
  const positions: PositionInput[] = [];
  for (let i = startPage; i <= numPages; i++) {
    const position: PositionInput = {
      x: x, //Posição x da assinatura do modelo em porcentagem
      y: y, //Posição y da assinatura do modelo em porcentagem
      z: i, //Numero da página
      element: PositionElementEnum.Signature,
    };
    positions.push(position);
  }
  return positions;
}

async function createDocument({ signers, document, filePath, }: CreateDocumentProps) {
  // if (environment == "development") {
  //   const response = await client.request(mutations.development, {
  //     file: fs.createReadStream(filePath),
  //     document,
  //     signers,
  //   });
  //   return response;
  // }

  const file = fs.createReadStream(filePath)

  console.dir({file}, {depth: null})

  const response = await client.request(mutations.production, {
    file,
    document,
    signers,
  });

  return response;

}

export async function submitToAutentique({ numPages, titulo, signer, filePath, x, y, startPage }: InterfaceSubmitToAutentiqueProps) {
  const signers: SignerInput[] = [
    {
      action: ActionEnum.Sign,
      email: signer.email,
      positions: setupAssignPositions(numPages, x, y, startPage),
      delivery_method: DeliveryMethodEnum.DeliveryMethodEmail,
      name: signer.name,
    },
  ];
  const document: DocumentInput = {
    name: titulo,
    configs: { signature_appearance: SignatureAppearanceEnum.Handwriting },
    message: `Favor assinar os certificados referentes ao ${titulo.toLocaleLowerCase().includes("talks")?"talks":"projeto"} "${titulo}".`,
    show_audit_page: false,
    footer: FooterEnum.Bottom,
  };

  const result = await createDocument({
    document,
    filePath,
    signers,
    numPages,
  });
  return result;
}

export async function submitCompletionCertificateToAutentique({ titulo, signer, filePath }: GenericSubmitToAutentiqueInterface) {
  const x = CompletionCertificatePositionAssign.eixoX;
  const y = CompletionCertificatePositionAssign.eixoY;
  return submitToAutentique({ numPages: 1, titulo, signer, filePath, x, y, startPage: 1  });
}

export async function submitTalksCertificateToAutentique({ titulo, signer, filePath }: GenericSubmitToAutentiqueInterface) {
  const x = TalksCertificatePositionAssign.eixoX;
  const y = TalksCertificatePositionAssign.eixoY;
  const numPages = await getNumberOfPages(filePath);

  return submitToAutentique({ numPages, titulo, signer, filePath, x, y, startPage: 2 });
}