export class FetchReponseError extends Error {
    code: number
    status: number
    message: string
    
    constructor(code: number, status: number, message: string) {
        super()
        this.code = code
        this.status = status
        this.message = message
    }
}