import fastify from "fastify";
import { competianosRoutes } from "./routes/competianos.routes";
import { certificadosRoutes } from "./routes/certificados.routes";
import { webhooksRoutes } from "./routes/webhooks.routes";
import { env } from "@/env";
import "../database"
import { talksRoutes } from "./routes/talks.routes";
import { projectsRoutes } from "./routes/projects.routes";
import { projectmembersRoutes } from "./routes/projectMembers.routes";
import { parceirosRoutes } from "./routes/parceiros.routes";

const port = env.PORT
const app = fastify();

app.register(competianosRoutes, { prefix: 'competianos' })
app.register(certificadosRoutes, { prefix: 'certificados' })
app.register(webhooksRoutes, { prefix: 'webhooks' })
app.register(talksRoutes, { prefix: 'talks' })
app.register(projectsRoutes, { prefix: 'projects' })
app.register(projectmembersRoutes, { prefix: 'projectMembers' })
app.register(parceirosRoutes, { prefix: 'parceiros' })

app.listen({
	host: '0.0.0.0', // auxilia front-end a conectar com aplicação mais pra frente
	port: port,
}).then(() => {
	console.log(`server listening on port ${port}`);
});