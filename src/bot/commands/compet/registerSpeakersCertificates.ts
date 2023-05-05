import { ApplicationCommandOptionType } from "discord.js"
import { Command } from "../../structures/Command"
import { submitTalksToAutentique } from "../../utils/autentiqueAPI"
import { getCompetTalksRegistration } from "../../utils/googleAPI/getCompetTalks"
import { createCertificadoTalksPalestrantes, formatarData } from "../../utils/python"


export default new Command({
    name: "certificar-palestrantes",
    description: "Comando para criar os certificados dos palestrantes",
    options: [
        {
            name: "titulo",
            type: ApplicationCommandOptionType.String,
            description: "O titulo do evento",
            required: true
        },
        {
            name: "palestrantes",
            type: ApplicationCommandOptionType.String,
            description: "A lista de palestrantes do evento em questão",
            required: true
        },
        {
            name: "tempo",
            type: ApplicationCommandOptionType.String,
            description: "A duração do evento em questão",
            required: true
        }],
    run: async function ({ interaction }) {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const isADM = member?.permissions.has("Administrator")
        if (isADM) {
            const palestrantes_input = interaction.options.get("palestrantes")?.value as string
            const listaNomes: string[] = palestrantes_input.split(",")
            const minutos = ((interaction.options.get("tempo")?.value as number) % 60).toString()
            const horas = Math.trunc((interaction.options.get("tempo")?.value as number) / 60).toString()
            try {

                const titulo = interaction.options.get("titulo")?.value as string
                const registration = await getCompetTalksRegistration(titulo)
                const data = new Date(registration[0].createTime)
                const filePath = await createCertificadoTalksPalestrantes({
                    titulo,
                    listaNomes,
                    data: formatarData(data),
                    horas,
                    minutos
                })
                await new Promise(resolve => setTimeout(resolve, 5000));
                const response = await submitTalksToAutentique(listaNomes.length, titulo, filePath)
                console.log(response);
                await new Promise(resolve => setTimeout(resolve, 5000));
                await interaction.reply({content:"Os certificados foram gerados e submetidos no autentique"})
            } catch (error: any) {
                console.log(error.message)
                await interaction.reply({ content: error.message, ephemeral: true })
            }

        }
    }
})