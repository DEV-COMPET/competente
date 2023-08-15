import { Command } from "../../structures/Command";
export default new Command({
  name: "lista",
  description: "Responde com o link da lista de presença",
  run: async ({ interaction }) => {
    await interaction.reply({
      content:
        "Para nossa lista de reunião, basta acessar o link https://forms.gle/JNaHV1TEJnb5DTPG7",
      ephemeral: true,
    });
  },
});
