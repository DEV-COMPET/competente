import { CompetianoModel, CompetianoType } from '../../entities/competiano.entity';
import type { CompetianoRepository as InterfaceCompetianoRepository } from '../';
import { DefaultMongoDBRepository } from '.';
export class CompetianoMongoDBRepository extends DefaultMongoDBRepository<CompetianoType> implements InterfaceCompetianoRepository {
  constructor(private competianoModel = CompetianoModel) {
    super(competianoModel);
  }
  public async list(): Promise<CompetianoType[]> {
    const competianos = this.competianoModel.find()
    return (await (competianos)).map((competiano) => {
      const result: CompetianoType = competiano.toJSON()
      return result
    })
  }
  public async getByName(nome: string): Promise<CompetianoType | undefined> {
    const competiano = await this.competianoModel.findOne({ nome })
    const result: CompetianoType | undefined = competiano?.toJSON()
    return result
  }
  public async getByEmail(email: string): Promise<CompetianoType | undefined> {
    const competiano = await this.competianoModel.findOne({ email })
    const result: CompetianoType | undefined = competiano?.toJSON()
    return result
  }
  public async create(data: CompetianoType): Promise<CompetianoType | undefined> {
    const model = new this.competianoModel(data)
    const createdData = await model.save()
    if (!createdData) {
      throw new Error("Failed to create new Data")
    }
    const result: CompetianoType = createdData.toJSON<CompetianoType>()
    return result
  }
  public async deleteByName(nome: string): Promise<CompetianoType | undefined> {
    const deletedMember = await this.competianoModel.findOne({ nome })
    if (!deletedMember) {
      return
    }
    await deletedMember.delete();
    return deletedMember.toJSON<CompetianoType>()
  }

}