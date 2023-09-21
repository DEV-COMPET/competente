
import type { TalksRepository as InterfaceTalksRepository } from "..";
import { DefaultMongoDBRepository } from ".";
import { TalksModel, TalksType } from "../../entities/talks.entity";

export class TalksRepository extends DefaultMongoDBRepository<TalksType> implements InterfaceTalksRepository {
   
    constructor(private talksModel = TalksModel) {
        super(talksModel);
    }
   
    public async create(data: TalksType): Promise<TalksType> {
        const model = new this.talksModel(data);
        const createdData = await model.save();
        if (!createdData) {
            throw new Error("Could not register talks");
        }
        const result: TalksType = createdData.toJSON<TalksType>();
        return result;
    }

    public async list(): Promise<TalksType[]> {
        const talksList = await this.talksModel.find();
        return talksList.map((talks) => {
            const result: TalksType = talks.toJSON();
            return result;
        });
    }

    public async getByTitulo( titulo: string ): Promise<TalksType | undefined> {
        const talks = await this.talksModel.findOne({ titulo });
        if (!talks) {
            return;
        }
        const result: TalksType = talks.toJSON<TalksType>();
        return result;
    }
}
