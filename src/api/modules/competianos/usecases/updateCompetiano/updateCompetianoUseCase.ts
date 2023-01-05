import { MemberData } from "../../repositories/defaultMongoDBRepository/competianoRepository";
import { CompetianoRepository } from "../../repositories";
import { CompetianoType } from "../../entities/competiano.entity";
export interface IUpdateCompetianoUseCase{
  execute:(nome:string,updatedData:MemberData)=>Promise<CompetianoType|undefined>
}
export class UpdateCompetianoUseCase implements IUpdateCompetianoUseCase{
  constructor(private repository:CompetianoRepository){}
  async execute(nome:string,updatedDate:MemberData):Promise<CompetianoType|undefined>{
    const member = await this.repository.getByName(nome)
    if(!member){
      return
    }
    const updatedMember = await this.repository.update(nome, updatedDate)
    return updatedMember
  }
}