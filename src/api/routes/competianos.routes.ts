import { Router } from "express";
import createCompetianoController from "../modules/competianos/usecases/createCompetiano";
import listCompetianoController from "../modules/competianos/usecases/listCompetiano"
const competianosRouter = Router();
competianosRouter.post("/", async (request, response) => createCompetianoController().handle(request, response))
competianosRouter.get("/", async (request, response) => listCompetianoController().handle(request, response))
export default competianosRouter