import {
  TutorModel, TutorType,
} from "../../entities/tutor.entity";
import type { TutorRepository as InterfaceTutorRepository } from "..";
import { DefaultMongoDBRepository } from ".";
export type MemberData = {
  nome?: string | undefined;
  email?: string | undefined;
  linkedin?: string | undefined;
  resumo?: string | undefined;
  urlImg?: string | undefined;
};
export class TutorMongoDBRepository
  extends DefaultMongoDBRepository<TutorType>
  implements InterfaceTutorRepository {
  constructor(private tutorModel = TutorModel) {
    super(tutorModel);
  }
  public async list(): Promise<TutorType[]> {
    const tutors = this.tutorModel.find();
    const result = (await tutors).map((tutor) => {
      const result: TutorType = tutor.toJSON();
      return result;
    });
    return result;
  }
  public async getByName(nome: string): Promise<TutorType | undefined> {
    const tutor = await this.tutorModel.findOne({ nome });
    const result: TutorType | undefined = tutor?.toJSON();
    return result;
  }
  public async getByEmail(email: string): Promise<TutorType | undefined> {
    const tutor = await this.tutorModel.findOne({ email });
    const result: TutorType | undefined = tutor?.toJSON();
    return result;
  }
  public async create(
    data: TutorType
  ): Promise<TutorType | undefined> {
    const model = new this.tutorModel(data);
    const createdData = await model.save();
    if (!createdData) {
      throw new Error("Failed to create new Data");
    }
    const result: TutorType = createdData.toJSON<TutorType>();
    return result;
  }
  public async deleteByName(nome: string): Promise<TutorType | undefined> {
    const deletedMember = await this.tutorModel.findOne({ nome });
    if (!deletedMember) {
      return;
    }
    await deletedMember.deleteOne();
    return deletedMember.toJSON<TutorType>();
  }
  public async update(
    nome: string,
    data: MemberData
  ): Promise<TutorType | undefined> {
    const updatedMember = await this.tutorModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedMember) {
      return;
    }
    return updatedMember.toJSON<TutorType>();
  }
}
