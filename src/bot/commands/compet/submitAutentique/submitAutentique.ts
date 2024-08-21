import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { partial_to_full_path, readJsonFile } from "@/bot/utils/json";
import { collectDocumentInfo } from "./utils/extractInputData";
import { submitToAutentique } from "@/bot/utils/autentiqueAPI/index";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";

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

    await editLoadingReply({ interaction, title: "AAAAAAAAAAAA" })

    // Define os customIds dos campos que deseja coletar
    const inputFields = ['titulo', 'email', 'nome', 'filePath', 'numPages'];

    // Coleta as informações do comando de interação
    const documentInfo = collectDocumentInfo({ interaction, inputFields });

    await editLoadingReply({ interaction, title: "BBBBBBBBBBBBBBBB" })

    // Envia o documento para assinatura no Autentique
    //Trocar os inputs
    try {
      const result = await submitToAutentique({
        numPages: 17,
        titulo: "Titulo teste",
        signer: { name: "Pedro", email: "pedroaugustogabironzani@gmail.com" },
        filePath: partial_to_full_path({
          dirname: __dirname, partialPath: 'aaa.pdf'
        })
      });


      await editSucessReply({
        interaction, title: `Documento "${documentInfo.titulo}" enviado para assinatura de ${documentInfo.nome} (${documentInfo.email}) com sucesso!`,
      })

      console.dir({result}, {depth: null});
      // Envia o resultado da operação para o usuário
      return result;

    } catch (error) {
      console.error("Erro ao enviar documento para assinatura:", error);

      await editErrorReply({
        error: new Error(), interaction, title: "Deu ruim"
      })

      // Envia o erro para o usuário
      return error;
    }
  },
});


