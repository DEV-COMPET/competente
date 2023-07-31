import { AutentiqueApiResponse } from "../../../../@types/autentique";
import { WebhookRepository as InterfaceWebhookRepository } from "../../repositories";
import { CompetianoRepository as InterfaceCompetianoRepository } from "../../../competianos/repositories";
import dotenv from "dotenv";
import {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Colors,
  WebhookMessageCreateOptions,
  WebhookClient,
} from "discord.js";
dotenv.config();
export interface InterfaceSendAutentiqueMessageUseCase {
  execute: (apiResponse: AutentiqueApiResponse) => Promise<{
    webhook: WebhookClient;
    payload: WebhookMessageCreateOptions;
  }>;
}
export class SendAutentiqueMessageUseCase
  implements InterfaceSendAutentiqueMessageUseCase
{
  constructor(
    private readonly whRepository: InterfaceWebhookRepository,
    private readonly competianoRepository: InterfaceCompetianoRepository
  ) {}
  async execute(apiResponse: AutentiqueApiResponse) {
    const guildId = process.env.DISCORD_GUILD_ID || "";
    const webhooks = await this.whRepository.listByName("Autentique Webhook");
    const existentWebhook = webhooks.find(
      (webhook) => webhook.guildId === guildId
    );
    if (!existentWebhook)
      throw new Error(
        "Não foi possível enviar a mensagem, o servidor em questão não possui um webhook cadastrado!"
      );
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
    const content = `Os certificados referentes ao ${apiResponse.documento.nome.toLocaleLowerCase().includes("talks")?"talks":"projeto"} ${apiResponse.documento.nome} estão liberados!`;
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
    return { webhook, payload };
  }
}
