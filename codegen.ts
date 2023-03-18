import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {
  schema: './src/bot/utils/autentiqueAPI/graphql/schema.graphql',
  generates: {
    './src/bot/utils/autentiqueAPI/graphql/resolvers-types.ts': {
      config: {
        useIndexSignature: true,
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};
export default config;