import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { PythonShellError } from "python-shell";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { generateInscriptionCertificate } from "./utils/generateInscriptionCertificate";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { generateSpeakerCertificate } from "./utils/generateSpeakerCertificate";
import { makeLoadingEmbed } from "@/bot/utils/embed/makeLoadingEmbed";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'closeTalksModalData.json' });

const closeTalksModal = makeModal(inputFields, modalBuilderRequest);

/**
 * @author Pedro Augusto de Portilho Ronzani 
 * @description Criação de um novo Talks.
 * Caso o usuário seja admin, um novo talks é salvo no banco de dados, emails são enviados para pessoas que ja se inscreveram em talks anteriores, e atualiza os titulos dos formulários de inscrição e emissão de certificados.  
 */

export default new Modal({
    customId: "close-talks",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const inputData = extractInputData({ interaction, inputFields })

        await interaction.editReply({
            embeds: [
                makeLoadingEmbed({
                    title: "Verificando se o titulo existe no banco de dados",
                    interaction,
                })
            ]
        })

        const validateInputDataResponse = await validateInputData(inputData)
        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                interaction,
                title: "Finalizar o talks devido a dados inválidos.",
                error: validateInputDataResponse.value.error
            })

        await editLoadingReply({
            interaction, title: "Talks cadastrado. Gerando certificado de visualização"
        })

        const { data, titulo, minutos, palestrantes } = validateInputDataResponse.value.inputData.talks

        const generateInscriptionCertificateResponse = await generateInscriptionCertificate({ titulo, data, minutos: minutos as number })
        if (generateInscriptionCertificateResponse.isLeft()) {
            if (generateInscriptionCertificateResponse.value.error instanceof PythonShellError)
                return await editErrorReply({
                    interaction,
                    title: "Erro do Python não identificado",
                    error: generateInscriptionCertificateResponse.value.error
                })

            if (generateInscriptionCertificateResponse.value.error instanceof PythonVenvNotActivatedError)
                return await editErrorReply({
                    interaction,
                    title: "Ambiente virtual do Python não ativado.",
                    error: generateInscriptionCertificateResponse.value.error
                })

            return await editErrorReply({
                interaction,
                title: "Erro não previsto. Verifique o log para mais informações.",
                error: generateInscriptionCertificateResponse.value.error
            })
        }

        await editLoadingReply({
            interaction, title: "Certificado de visualização gerado. Salvando-o na nuvem"
        })

        const updateInscriptionCertificateToFolderResponse = await uploadToFolder(generateInscriptionCertificateResponse.value.path_to_certificates)
        if (updateInscriptionCertificateToFolderResponse.isLeft())
            return await editErrorReply({
                interaction,
                title: "Erro durante o envio do certificado para o Google Drive.",
                error: updateInscriptionCertificateToFolderResponse.value.error
            })

        await editLoadingReply({
            interaction, title: "Certificado de visualização na nuvem. Gerando certificado de palestrante"
        })

        const generateSpeakerCertificateResponse = await generateSpeakerCertificate({ titulo, data, minutos: minutos as number, palestrantes })
        if (generateSpeakerCertificateResponse.isLeft()) {
            if (generateSpeakerCertificateResponse.value.error instanceof PythonShellError)
                return await editErrorReply({
                    interaction,
                    title: "Erro do Python não identificado",
                    error: generateSpeakerCertificateResponse.value.error
                })

            if (generateSpeakerCertificateResponse.value.error instanceof PythonVenvNotActivatedError)
                return await editErrorReply({
                    interaction,
                    title: "Ambiente virtual do Pythonn não ativado.",
                    error: generateSpeakerCertificateResponse.value.error
                })

            return await editErrorReply({
                interaction,
                title: "Erro não previsto. Verifique o log para mais informações.",
                error: generateSpeakerCertificateResponse.value.error
            })
        }

        await editLoadingReply({
            interaction, title: "Certificado de palestrante gerado. Salvando na nuvem"
        })

        const updateSpeakerCertificateToFolderResponse = await uploadToFolder(generateSpeakerCertificateResponse.value.path_to_certificates)
        if (updateSpeakerCertificateToFolderResponse.isLeft())
            return await editErrorReply({
                interaction,
                title: "Erro durante o envio do certificado para o Google Drive.",
                error: updateSpeakerCertificateToFolderResponse.value.error
            })

        await editLoadingReply({
            interaction, title: "Certificado de palestrante na nuvem"
        })

        // TODO: enviar certificados para autentique

        // TODO: enviar certificados via  email (mandar link por email de um lugar para baixar - talvez drive)

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Talks finalizado com Sucesso!!",
                    interaction,
                })
            ]
        })
    }
});

export { closeTalksModal };
