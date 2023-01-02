import { Router } from "express";
import createCompetianoController from "../modules/competianos/usecases/createCompetiano";
import listCompetianoController from "../modules/competianos/usecases/listCompetiano";
import getCompetianoByEmailController from "../modules/competianos/usecases/getCompetianoByEmail";
const competianosRouter = Router();
competianosRouter.post("/", async (request, response) => createCompetianoController().handle(request, response))
competianosRouter.get("/", async (request, response) => listCompetianoController().handle(request, response))
competianosRouter.get("/email", async (request, response) => getCompetianoByEmailController().handle(request, response))
export default competianosRouter