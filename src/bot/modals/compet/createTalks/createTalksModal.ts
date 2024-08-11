import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { createTalksInDatabase } from "./utils/createTalksInDatabase";
import { getEmails, sendMail } from "./utils/sendEmail";
import { updateInscricaoTalks, updateTalks } from "@/bot/utils/googleAPI/updateCompetTalks";
import { parser } from "@/bot/utils/googleAPI/getTalksInscriptions";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'createTalksModalData.json' });

const createTalksModal = makeModal(inputFields, modalBuilderRequest);

/**
 * @author Pedro Augusto de Portilho Ronzani 
 * @description Criação de um novo Talks.
 * Caso o usuário seja admin, um novo talks é salvo no banco de dados, emails são enviados para pessoas que ja se inscreveram em talks anteriores, e atualiza os titulos dos formulários de inscrição e emissão de certificados.  
 */
export default new Modal({
    customId: "createtalks",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const inputData = extractInputData({ interaction, inputFields })
        const validateInputDataResponse = validateInputData(inputData)
        if (validateInputDataResponse.isLeft()) {
            console.error(validateInputDataResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel criar o talks devido a dados inválidos.",
                        error: { code: 401, message: validateInputDataResponse.value.error.message },
                        interaction,
                    })
                ]
            })
        }

        const createTalksInDatabaseResponse = await createTalksInDatabase(validateInputDataResponse.value.inputData)
        if (createTalksInDatabaseResponse.isLeft()) {
            console.error(createTalksInDatabaseResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel enviar o talks para o Banco de Dados",
                        error: {
                            code: 401,
                            message: createTalksInDatabaseResponse.value.error.message
                        },
                        interaction,
                    })
                ]
            })
        }

        const emails = await getEmails()
        if (emails.isRight())
            console.dir(emails.value.emails.length)

        const sendMailResponse = await sendMail({
            subject: "Test subject from API",
            text: "Test text from API",
            emailsTest: ["pedroaugustogabironzani@gmail.com", "pedroaugustogabironzani@hotmail.com", "pedroapr1804@gmail.com", "pedroapr1804@hotmail.com"]
        })
        if (sendMailResponse.isLeft()) {
            console.error(sendMailResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel enviar os emails",
                        error: {
                            code: 401,
                            message: sendMailResponse.value.error.message
                        },
                        interaction,
                    })
                ]
            })
        }

        const updateCertificateResponse = await updateTalks(inputData.titulo);
        if (updateCertificateResponse.isLeft()) {
            console.error(updateCertificateResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel atualizar o titulo do Forms de Certificados.",
                        error: { code: 401, message: updateCertificateResponse.value.error.message },
                        interaction,
                    })
                ]
            })
        }

        const updateInscricaoTalksResponse = await updateInscricaoTalks(inputData.titulo);
        if (updateInscricaoTalksResponse.isLeft()) {
            console.error(updateInscricaoTalksResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel atualizar o titulo do Forms de Inscrição.",
                        error: { code: 401, message: updateInscricaoTalksResponse.value.error.message },
                        interaction,
                    })
                ]
            })
        }

        // TODO: agendar video no youtube

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Novo Talks cadastrado e Divulgado com Sucesso!!",
                    interaction,
                })
            ]
        })
    }
});

export { createTalksModal };
