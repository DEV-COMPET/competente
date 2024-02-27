export class InvalidEmailError extends Error {
    constructor(emailError: string[], emailRemovido: string[]){
        super(`Emails não removidos: 
                ${emailError.join(', ')}
            Os seguintes emails foram removidos:
                ${emailRemovido.join(', ')}`)
    }
}