import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { createCertificadoTalksPalestrantes } from "@/bot/utils/python";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { env } from "@/env";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'registerSpeakersCertificateData.json' });

const registerSpeakersCertificatesModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "speakercertificate",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const { nomes, titulo, data_completa, email_assinante, horas, minutos } = extractInputData({ interaction, inputFields })

        const registration = await getCompetTalksRegistration(titulo);
        if (registration.isLeft())
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Titulo de Talks Invalido!",
                        error: { code: 401, message: registration.value.error.message },
                        interaction
                    })
                ]
            })

        const filePath = await createCertificadoTalksPalestrantes({ titulo, listaNomes: nomes, data: data_completa, horas, minutos });
        if (filePath.isLeft())
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possível gerar os certificados PDF!",
                        error: { code: 401, message: filePath.value.error.message },
                        interaction
                    })
                ]
            })

        const updateToFolderResponse = await uploadToFolder(filePath.value.path_to_certificate)
        if (updateToFolderResponse.isLeft())
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possível enviar o arquivo para o Google Drive.",
                        error: { code: 401, message: updateToFolderResponse.value.error.message },
                        interaction,
                    })
                ]
            })

        /*
                    const response = await submitToAutentique(
                        {
                            numPages: listaNomes.length,
                            filePath,
                            titulo,
                            signer: { email: assigner_mail, name: assigner_name }
                        }
                    );
        */
        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Certificados de Palestrantes gerados com sucesso!",
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
        nomes: string
        titulo: string
        minutos_totais: number
        email_assinante: string
        data_completa: string
    }

    const { nomes, titulo, data_completa, email_assinante, minutos_totais }: InputFieldsRequest = Object.assign({}, ...input_data);

    const minutos = Math.trunc(minutos_totais % 60).toString()
    const horas = Math.trunc(minutos_totais / 60).toString()

    const nomes_separados = nomes.split(',').map(nome => { return nome.trim() })

    return { nomes: nomes_separados, titulo, data_completa, email_assinante, horas, minutos }
}

interface ExtractInputDataResponse {
    nomes: string[]
    titulo: string
    minutos: string
    horas: string
    email_assinante: string
    data_completa: string
}

export { registerSpeakersCertificatesModal };
