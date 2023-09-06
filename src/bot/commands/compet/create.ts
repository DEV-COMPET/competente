import { modal } from "@/bot/modals/compet/createMemberModal/createMemberModal";
import { Command } from "../../structures/Command";
import { makeNotAdminEmbed } from "@/bot/utils/embed/makeNotAdminEmbed";

export default new Command({
  name: "create",
  description: "Esse comando adiciona um novo competiano ao compet",
  run: async ({ interaction }) => {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");

    if (!isADM)
      return makeNotAdminEmbed(interaction)

    await interaction.showModal(modal);
  },
});
