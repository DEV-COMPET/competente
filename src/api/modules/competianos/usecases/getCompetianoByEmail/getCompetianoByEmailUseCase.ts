import { CompetianoType } from "../../entities/competiano.entity";
import { CompetianoRepository as InterfaceCompetianoRepository } from "../../repositories";
export interface IGetCompetianoByEmailUseCase{
  execute:(email:string)=>Promise<CompetianoType|undefined>
}
export class GetCompetianoByEmailUseCase implements IGetCompetianoByEmailUseCase{
  constructor(private readonly repository:InterfaceCompetianoRepository){}
  async execute(email: string): Promise<CompetianoType|undefined>{
    const competiano = await this.repository.getByEmail(email)
    return competiano
  }
}