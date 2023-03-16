import { Router } from "express";
import createCertificadosController from "../modules/certificados/useCases/createCertificados"
import getCertificatesController from "../modules/certificados/useCases/getCertificados";
import getCertificatesByTittleController from "../modules/certificados/useCases/getCertificadoByTittle";
const certificadosRouter = Router();
certificadosRouter.post("/", async (request, response) => createCertificadosController().handle(request, response));
certificadosRouter.get("/", async (request, response) => getCertificatesController().handle(request, response));
certificadosRouter.get("/:titulo", async (request, response) => getCertificatesByTittleController().handle(request, response));
export default certificadosRouter;
