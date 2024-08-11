export class InvalidInserirError extends Error {
    constructor(nome: string) {
        super(`Erro ao inserir os dados de ${nome}`)
    }
}