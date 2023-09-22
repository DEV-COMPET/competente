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
import { CertificatesType } from "@/api/modules/certificados/entities/certificados.entity"
import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { PythonShellError } from "python-shell";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { validateDriveLink } from "@/bot/utils/googleAPI/updateCompetTalks";
import { Either, left, right } from "@/api/@types/either";
import { InvalidDriveLinkError } from "@/bot/errors/invalidDriveLinkError";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";

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

        const { horas, minutos, titulo, link, data, /*nome_assinante,email_assinante*/ } = extractInputData({ interaction, inputFields })

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
                compbio: true, compet_talks: true,
                data, link, listaNomes, titulo
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

        /*
         const numPages = listaNomes.length;
         
          await submitToAutentique({
            numPages,
            titulo: titulo as string,
            filePathResponse,
            signer: { name: nome_assinante, email: email_assinante },
          });
        */

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

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        titulo: string,
        data_new: string
        email_assinante: string,
        nome_assinante: string,
        minutos_totais: number
        link: string
    }

    const { /*email_assinante,*/ link, minutos_totais, /*nome_assinante,*/ titulo, data_new }: InputFieldsRequest = Object.assign({}, ...input_data, { data_inicio: new Date().toISOString() });

    const minutos_input = minutos_totais as number;
    const timing: { horas: unknown; minutos: unknown } = {
        horas: Math.trunc(minutos_input / 60),
        minutos: minutos_input % 60,
    };
    const { horas, minutos } = {
        horas: timing.horas as string,
        minutos: timing.minutos as string,
    };

    const parts = data_new.split("-"); // Split the string into parts
    const day = parseInt(parts[0], 10); // Parse day as an integer
    const month = parseInt(parts[1], 10) - 1; // Parse month as an integer (months are 0-indexed)
    const year = parseInt(parts[2], 10); // Parse year as an integer

    const data = new Date(year, month, day);

    return { horas, link, minutos, titulo, data }
}

interface ExtractInputDataResponse {
    horas: string,
    minutos: string,
    link?: string,
    email_assinante?: string
    nome_assinante?: string
    titulo: string
    data: Date
}

type CreateCertificatesInDatabase = Either<
    { error: InvalidDriveLinkError },
    { sucess: boolean }
>

/**
 * @author Henrique de Paula Rodrigues
 * @description Cadastra certificados no banco de dados
 */
async function createCertificatesInDatabase(body: CertificatesType): Promise<CreateCertificatesInDatabase> {
    if (!validateDriveLink(body.link))
        return left({
            error: new InvalidDriveLinkError()
        })

    const url = `${env.HOST}certificados/`
    const options = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }

    // TODO: enviar email para a lista de participantes informando que o certificado está disponivel
    const response = await fetch(url, options);
    if (!(200 <= response.status && response.status < 300)) {

        const { code, message, status }: { code: number; message: string; status: number } = await response.clone().json();
        return left({
            error: new FetchReponseError({ code, status, message })
        })
    }

    return right({
        sucess: true
    })
}

export { registerTalksModal };
