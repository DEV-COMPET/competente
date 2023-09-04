import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import { WebhookRepository as InterfaceWebhookRepository } from "../../repositories";
import { CompetianoRepository as InterfaceCompetianoRepository } from "../../../competianos/repositories";
import { Either, left, right } from "@/api/@types/either";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";
import { AutentiqueApiResponse } from "@/api/@types/autentique";
import { ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, WebhookClient, WebhookMessageCreateOptions } from "discord.js";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { env } from "@/env";


interface SendAuthentiqueMessageCaseRequest {
    apiResponse: AutentiqueApiResponse
}

type SendAuthentiqueMessageCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    {
        webhook: WebhookClient, payload: WebhookMessageCreateOptions;
    }
>

export class SendAuthentiqueMessageCase {
    constructor(
        private readonly whRepository: InterfaceWebhookRepository,
        private readonly competianoRepository: InterfaceCompetianoRepository
      ) { }

    async execute({ apiResponse }: SendAuthentiqueMessageCaseRequest): Promise<SendAuthentiqueMessageCaseResponse> {

        const guildId = env.DISCORD_GUILD_ID;
        const webhooks = await this.whRepository.listByName("Autentique Webhook");
        const existentWebhook = webhooks.find(
            (webhook) => webhook.guildId === guildId
        );

        if (!existentWebhook)
            return left(new ResourceNotFoundError("Servidor sem webhook cadastrado"))

        const webhook = new WebhookClient({
            id: existentWebhook.id,
            token: existentWebhook.token,
        });

        const tutor = {
            nome: apiResponse.partes[0].nome || "",
            email: apiResponse.partes[0].email,
        };

        const tutorCompetData = await this.competianoRepository.getByEmail(
            tutor.email
        );

        const icon_url =
            tutorCompetData?.url_imagem ||
            `https://i.ibb.co/rpkBgxZ/msg-1183775647-43870.jpg`; // link para imagem do discord bot

        const content = `Os certificados referentes ao ${apiResponse.documento.nome.toLocaleLowerCase().includes("talks") ? "talks" : "projeto"} ${apiResponse.documento.nome} estão liberados!`;
        
        const embed = new EmbedBuilder()
            .setAuthor({
                name: tutor.nome,
                iconURL: icon_url,
            })
            .setFooter({
                text: `Documento criado em`,
                iconURL: `https://i.ibb.co/rpkBgxZ/msg-1183775647-43870.jpg`,
            })
            .setTitle(`${apiResponse.documento.nome} `)
            .setColor(Colors.Green)
            .setThumbnail(`https://i.ibb.co/rdXy6Bv/pdf-1.png`)
            .setTimestamp(new Date(apiResponse.documento.created))
            .setDescription("Para fazer o download basta clicar no link abaixo");
        
            const component = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: "Link",
            type: 2,
            url: apiResponse.arquivo.assinado,
            disabled: false,
        });

        const payload: WebhookMessageCreateOptions = {
            content,
            components: [{ type: 1, components: [component] }],
            embeds: [embed],
        };

        return right({ webhook, payload });
    }
}
