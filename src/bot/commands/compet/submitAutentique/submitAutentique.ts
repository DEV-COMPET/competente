import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { partial_to_full_path, readJsonFile } from "@/bot/utils/json";
import { collectDocumentInfo } from "./utils/extractInputData";
import { submitCompletionCertificateToAutentique, submitToAutentique } from "@/bot/utils/autentiqueAPI/index";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { env } from "@/env";
import { compressPDF } from "@/bot/utils/pdf/comprimirPDF";

const { name, description } = readJsonFile({
  dirname: __dirname,
  partialPath: "submitAutentique.json"
});

export default new Command({
  name,
  description,
  run: async ({ interaction }) => {
    const isNotAdmin = await checkIfNotAdmin(interaction);
    if (isNotAdmin.isRight()) {
      return isNotAdmin.value.response;
    }

    await interaction.deferReply({ ephemeral: true });

    // Define os customIds dos campos que deseja coletar
    const inputFields = ['titulo', 'email', 'nome', 'filePath', 'numPages'];

    // Coleta as informações do comando de interação
    const documentInfo = collectDocumentInfo({ interaction, inputFields });

    await editLoadingReply({ interaction, title: "Enviando o documento para o Autentique" });

    const fullPath = partial_to_full_path({
      dirname: __dirname, partialPath: '../../../buttons/certificadosTalks/static/pdfs/COMPET Talks: Aplicações da Inteligência Artificial na Aeropalinologia - 18 de Agosto de 2023 - Certificados.pdf'
    });

    const outputPath = partial_to_full_path({
      dirname: __dirname, partialPath: '../../../buttons/certificadosTalks/static/pdfs/COMPET Talks: Aplicações da Inteligência Artificial na Aeropalinologia - 18 de Agosto de 2023 - Certificados_Compressed.pdf'
    });

    await compressPDF(fullPath, outputPath);

    console.log("uihisdyhiu: ", outputPath)

    // Envia o documento para assinatura no Autentique
    //Trocar os inputs
    try {
      const result = await submitToAutentique({
        numPages: 9,
        titulo: "COMPET - Certificados de COMPET Talks: Aplicações da Inteligência Artificial na Aeropalinologia",
        signer: { 
          name: env.AUTENTIQUE_RECIPIENT_NAME, 
          email: env.AUTENTIQUE_RECIPIENT_EMAIL,
        },
        filePath: outputPath,
        x: "70",
        y: "71",
        startPage: 2
      });

      await editSucessReply({
        interaction, title: `Documento "${documentInfo.titulo}" enviado para assinatura de ${documentInfo.nome} (${documentInfo.email}) com sucesso!`,
      })

      console.dir({result}, {depth: null});
      // Envia o resultado da operação para o usuário
      return result;

    } catch (error) {
      console.error("Erro ao enviar documento para assinatura:", JSON.stringify(error, null, 2));

      await editErrorReply({
        error: new Error(), interaction, title: "Deu ruim"
      })

      // Envia o erro para o usuário
      return error;
    }
  },
});


