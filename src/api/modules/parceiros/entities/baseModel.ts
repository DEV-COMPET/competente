import { v4 as uuidV4 } from "uuid";
import type { WithId } from "../repositories";
export class BaseModel<T> {
  model: WithId<T>;
  constructor(model: T) {
    this.model = { ...model, id: uuidV4() };
  }
}
