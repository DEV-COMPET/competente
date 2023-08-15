import bodyParser from "body-parser";
import express from "express";
import competianosRouter from "./routes/competianos.routes";
import certificadosRouter from "./routes/certificados.routes";
import webhooksRouter from "./routes/webhooks.routes";
import "../database"
const port = process.env.PORT || 4444
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/competianos", competianosRouter)
app.use("/certificados", certificadosRouter)
app.use("/webhooks", webhooksRouter)
app.listen(4444, () => console.log(`server listening on port ${port}`))