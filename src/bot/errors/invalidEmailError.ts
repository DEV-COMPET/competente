export class InvalidEmailError extends Error {
    constructor(emailError: string[], emailRemovido: string[], status: string){
        super(`Emails não ${status}: 
                ${emailError.join(', ')}
            Os seguintes emails foram ${status}:
                ${emailRemovido.join(', ')}`)
    }
}