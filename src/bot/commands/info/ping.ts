import { Command } from "../../structures/Command";

export default new Command({
  name: 'ping',
  description: "replies with pong",
  run: async ({ interaction }) => {
   await interaction.reply({content:"Pong",ephemeral:true})
  },
})