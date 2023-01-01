import { ListCompetianoUseCase } from "./listCompetianoUseCase";
import { ListCompetianoController } from "./listCompetianoController";
import { CompetianoMongoDBRepository as CompetianoRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
export default (): ListCompetianoController => {
	const competianoRepository = new CompetianoRepository();
	const listCompetianoUseCase = new ListCompetianoUseCase(competianoRepository);
	const listCompetianoController = new ListCompetianoController(listCompetianoUseCase);
	return listCompetianoController;
};