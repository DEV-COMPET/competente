import { Command } from "../../structures/Command";

export default new Command({
  name: 'teste',
  description: "replies with pong",
  run: async ({ interaction }) => {
    interaction.followUp("Pong")
  },
})