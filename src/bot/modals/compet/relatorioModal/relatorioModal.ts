// src/bot/modals/relatorioModal.ts
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { ComponentType, TextInputStyle } from "discord.js";
import { registrarRelatorioNaPlanilha } from "@/bot/utils/googleAPI/relatorioSemanalUtils";

const inputFields: TextInputComponentData[] = [
  {
    type: ComponentType.TextInput,
    customId: "relatorio_texto",
    label: "O que foi feito na semana?",
    style: TextInputStyle.Paragraph, // 2
    required: true,
  },
];

// Configuração do modal
const modalBuilderRequest: ModalComponentData = {
  customId: "relatorio_semanal",
  title: "Relatório Semanal",
  components: [], // o makeModal deve preencher
};

const relatorioModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
  customId: "relatorio_semanal",

  run: async ({ interaction }) => {
    // Primeiro, defer a resposta para evitar timeout
    await interaction.deferReply({ ephemeral: true });

    const nomeExibido = interaction.member?.displayName || interaction.user.username;
    const relatorioTexto = interaction.fields.getTextInputValue("relatorio_texto");

    try {
      // Grava na planilha primeiro
      await registrarRelatorioNaPlanilha(nomeExibido, relatorioTexto);
      
      // Confirma o sucesso
      await interaction.editReply({
        content: `✅ **Relatório registrado com sucesso!**\n\n**${nomeExibido}:**\n${relatorioTexto}`,
      });
    } catch (error) {
      console.error("Erro ao registrar relatório:", error);
      
      // Informa o erro
      await interaction.editReply({
        content: `❌ **Erro ao registrar relatório**\n\nTente novamente mais tarde. O erro foi registrado nos logs.`,
      });
    }
  },
});


export { relatorioModal };
