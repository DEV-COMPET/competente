import bodyParser from "body-parser";
import express from "express";
import competianosRouter from "./routes/competianos.routes";
import "../database"
const port = process.env.PORT || 4444
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/competianos", competianosRouter)
app.listen(4444, () => console.log(`server listening on port ${port}`))