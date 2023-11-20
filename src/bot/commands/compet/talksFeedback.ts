import {
    EmbedBuilder,
    Interaction,
    SelectMenuInteraction,
    ComponentType,
  } from "discord.js";
  import { Command } from "../../structures/Command";
  import selectEventNameMenuData from "../../selectMenus/getTalksInfo/selectEventNameMenuData.json";
  import {
    getCompetTalksEligibleCertificateRecipients,
    getCompetTalksRegistration,
    getAverageGradeOfEachQuestion,
    ClosedQuestionAnswers,
    getAllSugestions,
    getFrequencyOfAnswersOfEachClosedQuestion,
  } from "@/bot/utils/googleAPI/getCompetTalks1";
  import { getAllEventNames } from "../../utils/googleAPI/getAllEventNames";
  import {
    makeStringSelectMenu,
    makeStringSelectMenuComponent,
  } from "@/bot/utils/modal/makeSelectMenu";
  import { makeEmbed } from "@/bot/utils/embed/makeEmbed";
  import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
  import { ExtendedInteraction } from "@/bot/typings/Commands";
  
  export default new Command({
    name: "talks-feedback",
    description: "Obtém as informações de um talks",
  
    run: async ({ interaction }) => {
      try {
        await handleInteraction(interaction);
      } catch (error) {
        console.error("Erro ao processar o comando:", error);
      }
    },
  });
  
  async function handleInteraction(interaction: ExtendedInteraction) {
    await interaction.deferReply({ ephemeral: true });
  
    if (interaction.replied) {
      console.log("A interação já foi respondida.");
      return;
    }
  
    const getAllEventNamesResponse = await getAllEventNames({ interaction });
  
    if (getAllEventNamesResponse.isLeft()) {
      return await editErrorReply({
        error: getAllEventNamesResponse.value.error,
        interaction,
        title: getAllEventNamesResponse.value.error.message,
      });
    }
  
    const { customId, minMax } = selectEventNameMenuData;
  
    const listEventNamesMenu = makeStringSelectMenu({
      customId: customId,
      type: ComponentType.StringSelect,
      options: getAllEventNamesResponse.value.events.map((event) => ({
        label: String(event),
        value: String(event),
      })),
      maxValues: minMax.max,
      minValues: minMax.min,
    });
  
    await interaction.editReply({
      content: `Escolha um Talks`,
      components: [await makeStringSelectMenuComponent(listEventNamesMenu)],
    });
  
    const filter = (i: Interaction) => i.isStringSelectMenu();
  
    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 15000,
    });
  
    if (collector !== undefined) {
      collector.on("collect", async (selectInteraction: SelectMenuInteraction) => {
        await handleSelectInteraction(selectInteraction);
        collector.stop();
      });
  
      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          console.log("O coletor atingiu o tempo limite.");
        }
      });
    }
  }
  
  async function handleSelectInteraction(
    selectInteraction: SelectMenuInteraction
  ) {
    const selectedOption = selectInteraction.values[0];
    const talksRegistrations = await getCompetTalksRegistration(selectedOption);
    const qntRegistrations = talksRegistrations ? talksRegistrations.length : 0;
  
    const talksCertificateRecipients =
      await getCompetTalksEligibleCertificateRecipients(selectedOption);
    const qntCertificateRecipients = talksCertificateRecipients
      ? talksCertificateRecipients.length
      : 0;
  
    const averageGrades = await getAverageGradeOfEachQuestion(selectedOption);
    const frequencyOfAnswersOfEachQuestion =
      await getFrequencyOfAnswersOfEachClosedQuestion(selectedOption);
    const sugestions = await getAllSugestions(selectedOption);
  
    const embed = new EmbedBuilder().setTitle(`Informações de '${selectedOption}'`);
  
    embed.addFields(
      { name: "Quantidade de inscrições:", value: `${qntRegistrations}` },
      {
        name: "Quantidade de certificados preenchidos:",
        value: `${qntCertificateRecipients}`,
      },
      { name: "Notas médias de cada pergunta:", value: "\n\n" }
    );
  
    const averageGradesKeys = Object.keys(averageGrades) as (keyof ClosedQuestionAnswers)[];
  

    
    for (const key of averageGradesKeys) {
      let value: string;

      if(isNaN(averageGrades[key])) {
        value = `Não há dados`;
      }

      else {
        value = `Nota média: ${(averageGrades[key]).toFixed(2)}\n`;
    
        for (let i = 1; i <= 5; i++) {
            if(frequencyOfAnswersOfEachQuestion[key][i - 1] === 0) continue;
            value += `Nota ${i}: ${frequencyOfAnswersOfEachQuestion[key][i - 1]}\n`;
        }
      }
  
      embed.addFields({ name: key, value: `${value}\n`, inline: true });
    }
  
    embed.addFields({
      name: "Sugestões:",
      value: `${sugestions.length > 0? sugestions.join(','): 'Nenhuma sugestão'}`,
    });
  
    await selectInteraction.editReply({ content: "Informações", embeds: [embed] });
  }
  