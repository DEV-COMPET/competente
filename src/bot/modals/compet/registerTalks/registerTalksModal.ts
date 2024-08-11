import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin"
import { createTalksPdf } from "@/bot/utils/python";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { env } from "@/env";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { PythonShellError } from "python-shell";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { extractInputData } from "./utils/extractInputData";
import { createCertificatesInDatabase } from "./utils/createCertificatesInDB";
import { submitToAutentique } from "@/bot/utils/autentiqueAPI";

// import { submitToAutentique } from "@/bot/utils/autentiqueAPI";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'registerTalksModalData.json' });


const registerTalksModal = makeModal(inputFields, modalBuilderRequest);

/**
 * @author Henrique de Paula Rodrigues, Pedro Augusto de Portilho Ronzani
 * @description Gera o PDF dos certificados, salva-os no Google Drive e Envia-os para o Autentique.
 */
export default new Modal({
    customId: "registertalks",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const { horas, minutos, titulo, link, data, nome_assinante, email_assinante } = extractInputData({ interaction, inputFields })

        const registration = await getCompetTalksRegistration(titulo);
        if (registration.isLeft()) {
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        error: { code: 401, message: registration.value.error.message },
                        interaction, title: "Titulo de Talks Invalido!"
                    })
                ]
            })
        }
        // TODO: const data = new Date(registration.value.eventRegistrations[0].createTime);
        const listaNomes = registration.value.eventRegistrations.map((registration) => registration.nome);

        if (link) {
            const createCertificatesInDatabaseResponse = await createCertificatesInDatabase({
                body: {
                    compbio: true, compet_talks: true,
                    data, link, listaNomes, titulo
                }
            })
            if (createCertificatesInDatabaseResponse.isLeft())
                return await interaction.editReply({
                    embeds: [
                        makeErrorEmbed({
                            error: { code: 401, message: createCertificatesInDatabaseResponse.value.error.message },
                            interaction, title: "Link inválido, você precisa informar um link do google drive válido pra que possamos cadastra-lo na nossa base de dados!"
                        })
                    ]
                })

            return await interaction.editReply({
                embeds: [
                    makeSuccessEmbed({
                        title: "Certificados de Presença gerados com sucesso!",
                        fields: [
                            {
                                name: "Nome do Evento",
                                value: `${titulo}`
                            },
                            {
                                name: "Link do Google Drive",
                                value: link
                            }
                        ],
                        interaction
                    })
                ]
            })
        }

        const filePathResponse = await createTalksPdf({ titulo: titulo, data: formatarData(data), listaNomes, horas, minutos });
        if (filePathResponse.isLeft()) {
            console.error(filePathResponse.value.error.message)
            if (filePathResponse.value.error instanceof PythonShellError)
                return await interaction.editReply({
                    embeds: [
                        makeErrorEmbed({
                            error: { code: 401, message: filePathResponse.value.error.message },
                            interaction, title: `Erro do Python não identificado`
                        })
                    ]
                })

            if (filePathResponse.value.error instanceof PythonVenvNotActivatedError)
                return await interaction.editReply({
                    embeds: [
                        makeErrorEmbed({
                            error: { code: 401, message: filePathResponse.value.error.message },
                            interaction, title: `Ambiente virtual do Pythonn não ativado.`
                        })
                    ]
                })

            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        error: { code: 401, message: filePathResponse.value.error.message },
                        interaction, title: `Erro não previsto. Verifique o log para mais informações.`
                    })
                ]
            })
        }

        const updateToFolderResponse = await uploadToFolder(filePathResponse.value.path_to_certificates)
        if (updateToFolderResponse.isLeft())
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        error: { code: 401, message: updateToFolderResponse.value.error.message },
                        interaction, title: "Erro durante o envio do certificado para o Google Drive."
                    })
                ]
            })

        const numPages = listaNomes.length;

        const submitToAutentiqueResponse = await submitToAutentique({
            numPages,
            titulo: titulo as string,
            filePath: filePathResponse.value.path_to_certificates,
            signer: { name: nome_assinante, email: email_assinante },
        });

        console.dir({ response: submitToAutentiqueResponse })

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Certificados de Presença gerados com sucesso!",
                    fields: [
                        {
                            name: "Nome do Evento",
                            value: `${titulo}`
                        },
                        {
                            name: "Link do Google Drive",
                            value: `https://drive.google.com/drive/folders/${env.GOOGLE_DRIVE_FOLDER_ID}`
                        }
                    ],
                    interaction
                })
            ]
        })
    }
});

export { registerTalksModal };
