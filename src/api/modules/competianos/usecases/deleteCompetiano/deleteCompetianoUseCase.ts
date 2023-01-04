import { CompetianoType } from "../../entities/competiano.entity";
import type {CompetianoRepository as InterfaceDeleteCompetianoRepository} from '../../repositories';
export interface InterfaceDeleteCompetianoUseCase {
	execute: (request:{nome:string}) => Promise<CompetianoType>;
};
export class DeleteCompetianoUseCase implements InterfaceDeleteCompetianoUseCase{
  constructor(private repository:InterfaceDeleteCompetianoRepository){}
  async execute (request:{nome:string}) : Promise<CompetianoType>{
    const deletedMember = await this.repository.deleteByName(request.nome)
    if(!deletedMember){
      throw new Error('Member not found')
    }
    return deletedMember;
  };
}