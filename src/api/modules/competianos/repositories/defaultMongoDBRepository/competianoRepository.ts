import {CompetianoModel, CompetianoType} from '../../entities/competiano.entity';
import type {CompetianoRepository as InterfaceCompetianoRepository} from '../';
import { DefaultMongoDBRepository } from '.';
export class CompetianoMongoDBRepository extends DefaultMongoDBRepository<CompetianoType> implements InterfaceCompetianoRepository {
  constructor(private competianoModel=CompetianoModel){
    super(competianoModel);
  }
  public async list(): Promise<CompetianoType[]> {
    const competianos= this.competianoModel.find()
    return (await (competianos)).map((competiano)=>{
      const result :CompetianoType = competiano.toJSON()
      return result
    })
  }
  public async getByName(name: string): Promise<CompetianoType | undefined> {
    const competiano= await this.competianoModel.findOne({name})
    const result:CompetianoType|undefined=competiano?.toJSON()
    return result
  }
  public async getByEmail(email: string): Promise<CompetianoType | undefined> {
    const competiano= await this.competianoModel.findOne({email})
    const result:CompetianoType|undefined=competiano?.toJSON()
    return result
  }

}