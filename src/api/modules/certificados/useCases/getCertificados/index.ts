import { GetCertificatesUseCase } from "./getCertificadosUseCase";
import { GetCertificatesController } from "./getCertificadosController";
import { CertificatesRepository } from "../../repositories/defaultMongoDBRepository/certificadosRepository";
export default (): GetCertificatesController => {
	const repository = new CertificatesRepository();
	const useCase = new GetCertificatesUseCase(repository);
	return new GetCertificatesController(useCase);
};