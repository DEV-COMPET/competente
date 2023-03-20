import { Router } from "express";
import { AutentiqueApiResponse } from "../@types/autentique";
import { CompetianoMongoDBRepository } from "../modules/competianos/repositories/defaultMongoDBRepository/competianoRepository";
import dotenv from "dotenv"
import { ButtonStyle, ButtonBuilder, EmbedBuilder, WebhookClient } from "discord.js";
dotenv.config()
const router = Router();
router.post("/autentique", async (request, response) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || ""
    const data: AutentiqueApiResponse = request.body
    const tutor = { nome: data.partes[0].nome || "Teste", email: data.partes[0].email || "teste@gmail.com" }
    const repository = new CompetianoMongoDBRepository()
    const tutorCompetData = await repository.getByEmail(tutor.email)
    const icon_url = tutorCompetData?.url_imagem || `https://i.ibb.co/rpkBgxZ/msg-1183775647-43870.jpg`
    const content = `Os certificados referentes ao talks \"${data.documento.nome}\" estão liberados!`

    const embed = new EmbedBuilder()
        .setAuthor({
            "name": tutor.nome,
            "iconURL": icon_url
        }).setFooter({
            "text": `Documento criado em`,
            "iconURL": `https://i.ibb.co/rpkBgxZ/msg-1183775647-43870.jpg`
        }).setTitle(`${data.documento.nome} `)
        .setColor(0x00FFFF)
        .setThumbnail(`https://i.ibb.co/rdXy6Bv/pdf-1.png`)
        .setTimestamp(new Date(data.documento.created))
        .setDescription("Para fazer o download basta clicar no link abaixo")
    const component = new ButtonBuilder({ style: ButtonStyle.Link, label: "Link", type: 2, url: data.arquivo.assinado, disabled: false })
    console.log(component);

    try {
        const webhook = new WebhookClient({
            url: "https://discord.com/api/webhooks/1087410272421023836/foTyHP9KD5oTlm1_2GT4ioBhvo-5u3aPawHjqvtmuthqv_rRHE4N2tBaMCfNl0k4AUxN"
        })
        await webhook?.send({
            content, embeds: [embed], components: [{ type: 1, components: [component] }],
        })
        return response.status(200).send()

    } catch (error) {
        console.error(error);
        return response.status(400).send()

    }
})
export default router