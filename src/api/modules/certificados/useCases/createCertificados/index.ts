import { CreateCertificatesUseCase } from "./createCertificadosUseCase";
import { CreateCertificatesController } from "./createCertificadosController";
import { CertificatesRepository } from "../../repositories/defaultMongoDBRepository/certificadosRepository";
export default (): CreateCertificatesController => {
	const repository = new CertificatesRepository();
	const useCase = new CreateCertificatesUseCase(repository);
	return new CreateCertificatesController(useCase);
};