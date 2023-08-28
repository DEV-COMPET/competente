import { competianosRoutes } from "./routes/competianos.routes";
import "../database"
import fastify from "fastify";
import { certificadosRoutes } from "./routes/certificados.routes";

const port = (process.env.PORT || 4444) as number
const app = fastify();

app.register(competianosRoutes, { prefix: 'competianos' })
app.register(certificadosRoutes, { prefix: 'certificados' })
// app.register(certificadosRouter, { prefix: 'certificados' })
// app.register(webhooksRouter, { prefix: 'webhooks' })

app.listen({
	host: '0.0.0.0', // auxilia front-end a conectar com aplicação mais pra frente
	port: port,
}).then(() => {
	console.log(`server listening on port ${port}`);
});

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use("/competianos", competianosRouter)
// app.use("/certificados", certificadosRouter)
// app.use("/webhooks", webhooksRouter)
// app.listen(4444, () => console.log(`server listening on port ${port}`))