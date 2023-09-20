import { TextInputComponentData, ModalComponentData, EmbedBuilder } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { getCompetTalksRegistration } from "@/bot/utils/googleAPI/getCompetTalks";
import { createCertificadoTalksPalestrantes } from "@/bot/utils/python";
import { uploadToFolder } from "@/bot/utils/googleAPI/googleDrive";
import { env } from "@/env";

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

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        try {
            await interaction.reply({ content: "boa", ephemeral: true });
            const { nomes, titulo, data_completa, email_assinante, horas, minutos } = extractInputData({ interaction, inputFields })

            const registration = await getCompetTalksRegistration(titulo);
            if (registration.isLeft()) {
                const embed = new EmbedBuilder()
                    .setColor(0xf56565)
                    .setTitle("Não foi possível completar essa ação!")
                    .setDescription(registration.value.error.message)
                    .setThumbnail(
                        "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
                    )
                    .addFields(
                        {
                            name: "Código do erro",
                            value: "401",
                            inline: false
                        },
                        {
                            name: "Mensagem do erro",
                            value: registration.value.error.message,
                            inline: false,
                        }
                    );

                return await interaction.reply({
                    content: "Não foi possível executar este comando",
                    ephemeral: true,
                    embeds: [embed],
                });
            }

            const filePath = await createCertificadoTalksPalestrantes({
                titulo, listaNomes: nomes, data: data_completa, horas, minutos,
            });

            console.log(`\nCertificados Locais: ${filePath}`)

            const updateToFolderResponse = await uploadToFolder(filePath)
            if (updateToFolderResponse.isLeft())
                throw updateToFolderResponse.value.error

            console.log(`\nCertificados no Google Drive: https://drive.google.com/drive/folders/${env.GOOGLE_DRIVE_FOLDER_ID}`)

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
        } catch (error: any) {
            return await interaction.reply({
                content: error.message,
                ephemeral: true
            });
        }
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
