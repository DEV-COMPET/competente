export interface ITalksFeedback {
    event: string,
    registrations: number,
    certifications: number,
    relevancia?: number,
    chanceIndicacao?: number,
    correspondenciaExpectativa?: number,
    nivelSatisfacao?: number,
    sugestoes?: string[]
}