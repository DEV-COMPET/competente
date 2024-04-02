export class InvalidEmailError extends Error {
    constructor(emailError: string, status: string){
        super(`Não foi possível ${status} o drive do compet com ${emailError}`)
    }
}