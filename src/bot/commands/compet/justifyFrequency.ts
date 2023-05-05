import { Command } from "../../structures/Command";
export default new Command({
  name: "justificar",
  description: "Responde com o link para justificar ausência da reunião",

  run: async ({ interaction }) => {
    await interaction.reply({
      content:
        "Para justificar sua ausência da reunião, basta acessar o link https://forms.gle/3RSryirdGMymKgVp7",
      ephemeral: true,
    });
  },
});
