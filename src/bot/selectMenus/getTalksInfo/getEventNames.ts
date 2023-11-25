import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectEventNameMenuData.json"
import { EmbedBuilder } from "discord.js";
import {
    getCompetTalksEligibleCertificateRecipients,
    getCompetTalksRegistration,
    getAverageGradeOfEachQuestion,
    ClosedQuestionAnswers,
    getAllSugestions,
    getFrequencyOfAnswersOfEachClosedQuestion,
  } from "@/bot/utils/googleAPI/getCompetTalks1";

/**
 * @author Pedro Vitor Melo Bitencourt
 * @description Retorna estatíscas sobre o talks selecionado
 */
export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        await interaction.deferReply();

        const selectedOption = interaction.values[0];
        const talksRegistrations = await getCompetTalksRegistration(selectedOption);
        const qntRegistrations = talksRegistrations ? talksRegistrations.length : 0;
    
        let talksCertificateRecipients;

        try {
            talksCertificateRecipients =
            await getCompetTalksEligibleCertificateRecipients(selectedOption);
        }
        catch(e) {
            talksCertificateRecipients = [];
        }

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
        value: `${sugestions.length > 0? sugestions.join('\n'): 'Nenhuma sugestão'}`,
        });
    
        await interaction.editReply({ content: "Informações", embeds: [embed] });
    }
});
