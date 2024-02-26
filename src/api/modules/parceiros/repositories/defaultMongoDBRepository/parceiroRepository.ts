import {
  ParceiroModel,
  ParceiroType,
} from "../../entities/parceiro.entity";
import type { ParceiroRepository as InterfaceParceiroRepository } from "..";
import { DefaultMongoDBRepository } from ".";
export type ParceiroData = {
  nome?: string;
  imgUrl?: string,
  url?: string,
};
export class ParceiroMongoDBRepository
  extends DefaultMongoDBRepository<ParceiroType>
  implements InterfaceParceiroRepository {
  constructor(private parceiroModel = ParceiroModel) {
    super(parceiroModel);
  }
  public async list(): Promise<ParceiroType[]> {
    const parceiros = this.parceiroModel.find();
    const result = (await parceiros).map((parceiro) => {
      const result: ParceiroType = parceiro.toJSON();
      return result;
    });
    return result;
  }
  public async getByName(nome: string): Promise<ParceiroType | undefined> {
    const parceiro = await this.parceiroModel.findOne({ nome });
    const result: ParceiroType | undefined = parceiro?.toJSON();
    return result;
  }
  public async getByEmail(email: string): Promise<ParceiroType | undefined> {
    const parceiro = await this.parceiroModel.findOne({ email });
    const result: ParceiroType | undefined = parceiro?.toJSON();
    return result;
  }
  public async create(
    data: ParceiroType
  ): Promise<ParceiroType | undefined> {
    const model = new this.parceiroModel(data);
    const createdData = await model.save();
    if (!createdData) {
      throw new Error("Failed to create new Data");
    }
    const result: ParceiroType = createdData.toJSON<ParceiroType>();
    return result;
  }
  public async deleteByName(nome: string): Promise<ParceiroType | undefined> {
    const deletedMember = await this.parceiroModel.findOne({ nome });
    if (!deletedMember) {
      return;
    }
    await deletedMember.deleteOne();
    return deletedMember.toJSON<ParceiroType>();
  }
  public async update(
    nome: string,
    data: ParceiroData
  ): Promise<ParceiroType | undefined> {
    const updatedMember = await this.parceiroModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedMember) {
      return;
    }
    return updatedMember.toJSON<ParceiroType>();
  }
}
