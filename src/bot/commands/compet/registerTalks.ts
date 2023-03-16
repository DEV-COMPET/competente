import { EmbedBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import { getCompetTalksRegistration } from "../../utils/googleAPI/getCompetTalks";
function validateLink(link: string): boolean {
    const regex = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(\/view)?(\?usp=sharing)?$/;

    return regex.test(link)
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
            required: true
        }
    ],

    run: async ({ interaction }) => {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const isADM = member?.permissions.has("Administrator")
        if (isADM) {
            const titulo = interaction.options.get("titulo")?.value as string
            const link = interaction.options.get("link")?.value as string
            if (!titulo || !link) {
                return interaction.reply({
                    content: "Você precisa informar o titulo e o link do drive",
                    ephemeral: true
                })
            }
            try {
                const registration = await getCompetTalksRegistration(titulo)
                const listaNomes = registration.map(registration => registration.nome)

                await interaction.reply({ content: "boa", ephemeral: true })
            } catch (error: any) {
                console.log(error.message)
                await interaction.reply({ content: error.message, ephemeral: true })

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

        }
    }
})