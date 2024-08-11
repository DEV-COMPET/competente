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
import { CertificatePositionAssign } from "../../typings/talks";
import { env } from "@/env";
import { RequestInfo, RequestInit } from 'node-fetch';

const nodeFetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

const environment = env.ENVIRONMENT;
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

function setupAssignPositions(numPages: number): PositionInput[] {
  const positions: PositionInput[] = [];
  for (let i = 1; i <= numPages; i++) {
    const position: PositionInput = {
      x: CertificatePositionAssign.eixoX, //Posição x da assinatura do modelo em porcentagem
      y: CertificatePositionAssign.eixoY, //Posição y da assinatura do modelo em porcentagem
      z: i + 1, //Numero da página
      element: PositionElementEnum.Signature,
    };
    positions.push(position);
  }
  return positions;
}

async function createDocument({ signers, document, filePath, }: CreateDocumentProps) {
  if (environment == "development") {
    const response = await client.request(mutations.development, {
      file: fs.createReadStream(filePath),
      document,
      signers,
    });
    return response;
  }
  const response = await client.request(mutations.production, {
    file: fs.createReadStream(filePath),
    document,
    signers,
  });
  return response;
}

export async function submitToAutentique({ numPages, titulo, signer, filePath }: InterfaceSubmitToAutentiqueProps) {
  const signers: SignerInput[] = [
    {
      action: ActionEnum.Sign,
      email: signer.email,
      positions: setupAssignPositions(numPages),
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
