import { gql } from "graphql-tag";
import FormData from "form-data";
import dotenv from "dotenv";
import fs from "fs";
import { ActionEnum, DeliveryMethodEnum, DocumentInput, FooterEnum, PositionElementEnum, PositionInput, ReminderEnum, SignatureAppearanceEnum, SignerInput } from "./graphql/resolvers-types";
import { AwesomeGraphQLClient } from "awesome-graphql-client";
import nodeFetch from "node-fetch"
import { DocumentNode, print } from "graphql";
import { CertificatePositionAssign } from "../../typings/talks";
import { response } from "express";
dotenv.config();
const environment = process.env.environment || "development";
const API_URL = process.env.AUTENTIQUE_URL || "";
const authToken = process.env.AUTENTIQUE_TOKEN;
const client = new AwesomeGraphQLClient({
  endpoint: API_URL,
  fetch: nodeFetch,
  FormData,
  fetchOptions: {
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  },
  formatQuery: (query: DocumentNode | string) =>
    typeof query === "string" ? query : print(query)

})
// Essa mutation é usada para criar um documento no autentique no modo desenvolvimento
const CREATE_DOCUMENT_MUTATION_DEVELOPMENT = gql`
  mutation CreateDocumentMutation(
    $document: DocumentInput!,
    $signers: [SignerInput!]!,
    $file: Upload!
  ) {
    createDocument(
      sandbox:true
      document: $document,
      signers: $signers,
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
        action { name }
        link { short_link }
        user { id name email }
      }
    }
  }
`;
const CREATE_DOCUMENT_MUTATION_PRODUCTION = gql`
  mutation CreateDocumentMutation(
    $document: DocumentInput!,
    $signers: [SignerInput!]!,
    $file: Upload!
  ) {
    createDocument(
      sandbox:false
      document: $document,
      signers: $signers,
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
        action { name }
        link { short_link }
        user { id name email }
      }
    }
  }
`;
const mutations = { "development": CREATE_DOCUMENT_MUTATION_DEVELOPMENT, "production": CREATE_DOCUMENT_MUTATION_PRODUCTION };
function setupAssignPositions(numPages: number): PositionInput[] {
  const positions: PositionInput[] = []
  for (let i = 1; i <= numPages; i++) {
    const position: PositionInput = {
      x: CertificatePositionAssign.eixoX, //Posição x da assinatura do modelo em porcentagem
      y: CertificatePositionAssign.eixoY, //Posição y da assinatura do modelo em porcentagem
      z: i + 1, //Numero da página
      element: PositionElementEnum.Signature
    }
    positions.push(position);
  }
  return positions;
}
interface CreateDocumentProps {
  filePath: string,
  numPages: number,
  signers: SignerInput[],
  document: DocumentInput
}

async function createDocument({ signers, document, filePath }: CreateDocumentProps) {
  if (environment == "development") {
    const response = await client.request(mutations.development, { file: fs.createReadStream(filePath), document, signers });
    return response
  }
  const response = await client.request(mutations.production, { file: fs.createReadStream(filePath), document, signers });
  return response
}
export async function submitTalksToAutentique(numPages: number, titulo: string, filePath: string) {
  const signers: SignerInput[] = [
    {
      action: ActionEnum.Sign,
      email: process.env.AUTENTIQUE_TUTOR_EMAIL || "teste@gmail.com",
      positions: setupAssignPositions(numPages),
      delivery_method: DeliveryMethodEnum.DeliveryMethodEmail,
      name: process.env.AUTENTIQUE_TUTOR_NAME || "Autenticação de teste",
    }
  ];
  const document: DocumentInput = {
    name: titulo,
    configs: { signature_appearance: SignatureAppearanceEnum.Handwriting },
    message: `Favor assinar os certificados referentes ao talks \"${titulo}\".`,
    show_audit_page: false,
    footer: FooterEnum.Right,
    
  };
  const result = await createDocument({ document, filePath, signers, numPages })
  return result
}
