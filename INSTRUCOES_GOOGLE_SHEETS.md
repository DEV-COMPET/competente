# Como Configurar Google Sheets API

## Passo 1: Criar Service Account no Google Cloud Console

1. Acesse https://console.cloud.google.com/
2. Selecione ou crie um projeto
3. Vá para "APIs e Serviços" → "Credenciais"
4. Clique em "Criar Credenciais" → "Conta de Serviço"
5. Preencha os dados da conta de serviço
6. Após criar, clique na conta criada
7. Vá para a aba "Chaves"
8. Clique em "Adicionar Chave" → "Criar Nova Chave" → "JSON"
9. O arquivo JSON será baixado

## Passo 2: Habilitar Google Sheets API

1. No Google Cloud Console, vá para "APIs e Serviços" → "Biblioteca"
2. Procure por "Google Sheets API"
3. Clique e ative a API

## Passo 3: Configurar Variáveis de Ambiente

No arquivo JSON baixado, você encontrará algo assim:
```json
{
  "type": "service_account",
  "project_id": "seu-projeto-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhki...\n-----END PRIVATE KEY-----\n",
  "client_email": "sua-conta@seu-projeto-123456.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

Adicione estas linhas no seu arquivo `.env`:

```bash
# Google Sheets API Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=sua-conta@seu-projeto-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhki...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:** 
- Mantenha as aspas duplas na GOOGLE_PRIVATE_KEY
- NÃO remova os \n do início e fim da chave
- NÃO commite este arquivo .env no Git (já está no .gitignore)

## Passo 4: Dar Permissão à Planilha

1. Abra sua planilha do Google Sheets
2. Clique em "Compartilhar" 
3. Adicione o email da service account (GOOGLE_SERVICE_ACCOUNT_EMAIL)
4. Dê permissão de "Editor"

## Exemplo de .env

```bash
# ... outras variáveis ...

# Google Sheets API Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=compet-bot@compet-project-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## Testando

Após configurar, teste o comando `/relatorio` no Discord. Os logs no console mostrarão se a autenticação está funcionando.
