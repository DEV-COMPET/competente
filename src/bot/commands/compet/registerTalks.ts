import { EmbedBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "discord.js";
import path from "path";
import { CertificatesType } from "../../../api/modules/certificados/entities/certificados.entity";
import { Command } from "../../structures/Command";
import { submitTalksToAutentique } from "../../utils/autentiqueAPI";
import { getCompetTalksRegistration } from "../../utils/googleAPI/getCompetTalks";
import { createTalksPdf, formatarData } from "../../utils/python";
function validateLink(link: string): boolean {
    const regex = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(\/view)?(\?usp=share_link)?$/;
    return regex.test(link);
}
export default new Command({
    name: "register-talks",
    description: "Registra os certificados assinados do talks em questão",
    options: [
        {
            name: "titulo",
            description: "O titulo do talks a ser registrado",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "link",
            description: "O link do drive que contem os certificados",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async ({ interaction }) => {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const isADM = member?.permissions.has("Administrator")
        if (isADM) {
            const titulo = interaction.options.get("titulo")?.value as string
            const link = interaction.options.get("link")?.value as string
            if (!titulo) {
                await interaction.reply({
                    content: "Você precisa informar o titulo do evento!",
                    ephemeral: true
                })
                return;
            }
            try {
                const registration = await getCompetTalksRegistration(titulo)
                const listaNomes = registration.map(registration => registration.nome)
                const data = new Date(registration[0].createTime)
                const compet_talks = true
                const compbio = false
                // Caso um link seja passado como parâmetro então a operação é apenas de cadastro de um certificado já existente e já autenticado,
                if (link) {
                    if (!validateLink(link)) {
                        await interaction.reply({
                            content: "Link inválido, você precisa informar um link do google drive válido pra que possamos cadastra-lo na nossa base de dados!",
                            ephemeral: true
                        })
                        return;
                    }
                    const body: CertificatesType = { data, compbio, compet_talks, link, listaNomes, titulo }
                    const url = "http://localhost:4444/certificados/"
                    console.log(body);
                    const response = await fetch(url, {
                        method: "post",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    })
                    if (response.status >= 200 && response.status < 300) {
                        // TODO: enviar email para a lista de participantes informando que o certificado está disponivel
                        const data = await response.json();
                        console.log(data);

                        await interaction.reply({ content: "Certificados registrados com sucesso!", ephemeral: true })
                    } else {
                        const data: { code: number, message: string } = await response.json()

                        await interaction.reply({
                            content: `Erro ${data.code}: ${data.message}`,
                            ephemeral: true
                        })
                    }
                    return;
                } else {
                    const body: CertificatesType = { data, compbio, compet_talks, link: "teste", listaNomes, titulo }
                    try {
                        await interaction.reply({ content: "boa", ephemeral: true })
                        const filePath = await createTalksPdf({ titulo, data: formatarData(data), listaNomes })
                        console.log(filePath);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        const response = await submitTalksToAutentique(listaNomes.length, titulo, filePath)
                        console.log(response);
                        return
                    } catch (error: any) {
                        console.error(error);
                        await interaction.reply({ content: error.message, ephemeral: true })
                        return
                    }
                }
            } catch (error: any) {
                console.log(error.message)
                await interaction.reply({ content: error.message, ephemeral: true })
                return;
            }
        }
        else {
            const embed = new EmbedBuilder()
                .setColor(0xF56565)
                .setTitle("Não foi possível utilizar este comando!")
                .setDescription("Você não possui autorização necessária.")
                .setThumbnail("https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png")
                .addFields(
                    { name: "Código do erro", value: "401", inline: false },
                    { name: "Mensagem do erro", value: "Você precisa ter permissão de administrador para executar esse comando", inline: false },
                )
            await interaction.reply({
                content: "Não foi possível executar este comando",
                ephemeral: true,
                embeds: [embed]
            })
            return;
        }
    }
})