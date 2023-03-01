import { Router } from "express";
import createCertificadosController from "../modules/certificados/useCases/createCertificados"
const certificadosRouter = Router();
certificadosRouter.post("/",async(request,response)=>createCertificadosController().handle(request,response));
export default certificadosRouter;
