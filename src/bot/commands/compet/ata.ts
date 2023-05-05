import { Command } from "../../structures/Command";
export default new Command({
  name: "ata",
  description: "Responde com o link da ATA da reunião",
  run: async ({ interaction }) => {
    await interaction.reply({
      content:
        "Para preencher nossa ATA de reunião, basta acessar o link https://forms.gle/Qk329ovkBmTcv6BMA",
      ephemeral: true,
    });
  },
});
