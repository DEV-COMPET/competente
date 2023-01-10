import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
export default new Command( {
  name:"quit-member",
  description:"Esse comando é utilizado para anunciar que um membro está de saída",
  options:[{name:"exiting_member",description:"O membro de saida do compet",type:ApplicationCommandOptionType.String,required:true}],
  run: async ({interaction}) => {
    console.log(interaction.user.fetch());
    await interaction.reply("That's it!")
  }
})