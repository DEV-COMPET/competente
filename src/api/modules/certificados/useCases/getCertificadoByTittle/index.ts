import { GetCertificatesByTittleUseCase } from "./getCertificadoByTittleUseCase";
import { GetCertificatesByTittleController } from "./getCertificadoByTittleController";
import { CertificatesRepository } from "../../repositories/defaultMongoDBRepository/certificadosRepository";
export default (): GetCertificatesByTittleController => {
    const repository = new CertificatesRepository();
    const useCase = new GetCertificatesByTittleUseCase(repository);
    return new GetCertificatesByTittleController(useCase);
};