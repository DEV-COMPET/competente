import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name:"add",
  description:"Teste",
  options:[{name:"member_name",type:ApplicationCommandOptionType.String,description:"teste",required:true}],
  run:async({interaction})=>{
    interaction.followUp("sim")
  }
})