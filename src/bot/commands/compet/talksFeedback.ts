import { EmbedBuilder, Interaction, SelectMenuInteraction } from "discord.js";
import { Command } from "../../structures/Command";
import  selectEventNameMenuData from "../../selectMenus/getTalksInfo/selectEventNameMenuData.json"
import { getCompetTalksEligibleCertificateRecipients, getCompetTalksRegistration, getAverageGradeOfEachQuestion, ClosedQuestionAnswers, getAllSugestions, getFrequencyOfAnswersOfEachClosedQuestion } from "@/bot/utils/googleAPI/getCompetTalks1";
import { getAllEventNames } from "../../utils/googleAPI/getAllEventNames";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { makeEmbed } from "@/bot/utils/embed/makeEmbed";
import { ComponentType } from "discord.js";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { ExtendedInteraction } from "@/bot/typings/Commands";

export default new Command({
  name: "talks-feedback",
  description: "Obtém as informações de um talks",

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Verificar se a interação já foi respondida
      if (interaction.replied) {
        console.log("A interação já foi respondida.");
        return;
      }

    const getAllEventNamesResponse = await getAllEventNames({ interaction });
    if (getAllEventNamesResponse.isLeft())
        return await editErrorReply({
            error: getAllEventNamesResponse.value.error,
                interaction,
                title: getAllEventNamesResponse.value.error.message
        });

    const { customId, minMax } = selectEventNameMenuData;


    const listEventNamesMenu = makeStringSelectMenu({
        customId: customId,
        type: ComponentType.StringSelect,
        options: getAllEventNamesResponse.value.events.map(event => {
            return {
                label: String(event),
                value: String(event)
            }
        }),
        maxValues: minMax.max,
        minValues: minMax.min
    });

    await interaction.editReply({
        content: `Escolha um Talks`,
        components: [await makeStringSelectMenuComponent(listEventNamesMenu)],
    });

    const filter = (i: Interaction) => {
        if(i.isStringSelectMenu()) {
            const selectMenuInteraction = i as SelectMenuInteraction;
            return selectMenuInteraction.customId === customId;
        }
        return false;
    }
    const collector = interaction.channel?.createMessageComponentCollector({
        filter,
        time: 15000
    });

    if(collector !== undefined) {
        collector.on("collect", async (selectInteraction: SelectMenuInteraction) => {
            if(selectInteraction.isStringSelectMenu()) {
                // Ações a serem realizadas quando o usuário seleciona uma opção no menu
                const selectedOption = selectInteraction.values[0];
                console.log('=======================================================');
                
                // await selectInteraction.deferReply({ ephemeral: true });
                console.log('***********************************************************************')
                // Continuar com as ações desejadas usando a opção selecionada
                const talksRegistrations = await getCompetTalksRegistration(selectedOption);
                const qntRegistrations = talksRegistrations ? talksRegistrations.length : 0;


                const talksCertificateRecipients = await getCompetTalksEligibleCertificateRecipients(selectedOption);
                const qntCertificateRecipients = talksCertificateRecipients ? talksCertificateRecipients.length : 0;
                
                const averageGrades = await getAverageGradeOfEachQuestion(selectedOption);
                const frequencyOfAnswersOfEachQuestion = await getFrequencyOfAnswersOfEachClosedQuestion(selectedOption);
                const sugestions = await getAllSugestions(selectedOption);

                const embed = new EmbedBuilder().setTitle(`Informações de '${selectedOption}'`).addFields(
                { name: "Quantidade de inscrições:", value: `${qntRegistrations}` },
                { name: "Quantidade de certificados preenchidos:", value: `${qntCertificateRecipients}` },
                { name: "Notas médias de cada pergunta:", value: "\n\n"}
                );

                const averageGradesKeys = Object.keys(averageGrades) as (keyof ClosedQuestionAnswers)[];

                for(const key of averageGradesKeys) {
                    let value = `Nota média: ${(averageGrades[key]).toFixed(2)}\n`

                    for(let i = 1; i <= 5; i++) {
                        value += `Nota ${i}: ${frequencyOfAnswersOfEachQuestion[key][i - 1]}\n`
                    }

                    embed.addFields({ name: key, value: `${value}\n`, inline: true })
                }

                embed.addFields({
                    name: 'Sugestões:', value: `${sugestions.join('\n')}`
                })


                // Enviar a resposta final
                await selectInteraction.editReply({ content: 'Informações', embeds: [embed] });

                // Encerrar o coletor após a conclusão
                collector.stop();
            }
            else {
                console.error("OIHIUDSGOIHOUIWSHQNJ")
            }
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
            // Ações a serem realizadas se o coletor atingir o tempo limite
            console.log("O coletor atingiu o tempo limite.");
            }
        });
    }

    } catch (error) {
      console.error("Erro ao processar o comando:", error);
    }
  },
});
