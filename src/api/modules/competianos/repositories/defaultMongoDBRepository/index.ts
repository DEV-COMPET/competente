import { Model } from "mongoose";
import { Repository } from "..";
export abstract class DefaultMongoDBRepository<T>extends Repository<T>{
  constructor(private model : Model<T>){
    super();
  }
  public async create(data: T): Promise<void> {
    const model = new this.model(data)
    const createdData = await model.save()
    if(!createdData){
      throw new Error("Failed to create new Data")
    }
  }
}