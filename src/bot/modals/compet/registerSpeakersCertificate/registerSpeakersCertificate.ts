import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { createCertificadoTalksPalestrantes } from "@/bot/utils/python";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { env } from "@/env";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { extractInputData } from "./utils/extractInputData";

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

        const { nomes, titulo, data_completa, /*email_assinante,*/ horas, minutos } = extractInputData({ interaction, inputFields })

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

export { registerSpeakersCertificatesModal };
