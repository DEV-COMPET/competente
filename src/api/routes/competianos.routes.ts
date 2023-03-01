import { Router } from "express";
import createCompetianoController from "../modules/competianos/usecases/createCompetiano";
import listCompetianoController from "../modules/competianos/usecases/listCompetiano";
import getCompetianoByEmailController from "../modules/competianos/usecases/getCompetianoByEmail";
import deleteCompetiano from "../modules/competianos/usecases/deleteCompetiano";
import updateCompetiano from "../modules/competianos/usecases/updateCompetiano";
const competianosRouter = Router();
competianosRouter.get("/", async (request, response) => listCompetianoController().handle(request, response))
competianosRouter.get("/email", async (request, response) => getCompetianoByEmailController().handle(request, response))
competianosRouter.post("/", async (request, response) => createCompetianoController().handle(request, response))
competianosRouter.put("/", async (request, response) => updateCompetiano().handle(request, response))
competianosRouter.delete("/", async (request, response) => deleteCompetiano().handle(request, response))
export default competianosRouter