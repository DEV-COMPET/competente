import {
  MateriasModel,
  MateriasType,
} from "../../entities/materias.entity";
import type { MateriaRepository as InterfaceMateriaRepository } from "..";
import { DefaultMongoDBRepository } from ".";
export class MateriasRepository extends DefaultMongoDBRepository<MateriasType> implements InterfaceMateriaRepository {

  constructor(private materiaModel = MateriasModel) {
    super(materiaModel);
  }

  public async deleteByNome(titulo: string): Promise<MateriasType | undefined> {
    const deletedMaterias = await this.materiaModel.findOne({ titulo });
    if (!deletedMaterias) 
      return;
    await deletedMaterias.deleteOne();
    return deletedMaterias.toJSON<MateriasType>();
  }

  public async create(data: MateriasType): Promise<MateriasType> {
    const model = new this.materiaModel(data);
    const createdData = await model.save();
    if (!createdData) {
      throw new Error("Could not register materia");
    }
    const result: MateriasType = createdData.toJSON<MateriasType>();
    return result;
  }

  public async list(): Promise<MateriasType[]> {
    const materiaList = await this.materiaModel.find();
    return materiaList.map((materias) => {
      const result: MateriasType = materias.toJSON();
      return result;
    });
  }
  public async getByNome(nome: string): Promise<MateriasType | undefined> {
    const materias = await this.materiaModel.findOne({ nome });
    if (!materias) {
      return;
    }
    const result: MateriasType = materias.toJSON<MateriasType>();
    return result;
  }
}