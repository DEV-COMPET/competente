import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { createTalksPdf } from "@/bot/utils/python";
import { formatarData } from "@/bot/utils/formatting/formatarData";
import { PythonShellError } from "python-shell";
import { PythonVenvNotActivatedError } from "@/bot/errors/pythonVenvNotActivatedError";
import { salvador, saveDataToJson } from "@/bot/utils/googleAPI/getTalksInscriptions";
import { parseDataFromSheet } from "@/bot/utils/googleAPI/getSheetsData";

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
        const validateInputDataResponse = await validateInputData(inputData)
        if (validateInputDataResponse.isLeft()) {
            console.error(validateInputDataResponse.value.error)
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Finalizar o talks devido a dados inválidos.",
                        error: { code: 401, message: validateInputDataResponse.value.error.message },
                        interaction,
                    })
                ]
            })
        }

        const { data, titulo, minutos } = validateInputDataResponse.value.inputData.talks

        // TODO: gerar  certificados de   participantes
        // TODO: gerar  certificados de   palestrantes

/*
        const filePathResponse = await createTalksPdf({
            titulo: titulo,
            data: formatarData(data),
            listaNomes: inscritos as string[],
            horas: Math.trunc((minutos as number) / 60).toString(),
            minutos: Math.trunc((minutos as number) % 60).toString()
        });
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
*/
        // TODO: enviar certificados para autentique
        // TODO: enviar certificados via  email

        console.dir({ talks: validateInputDataResponse.value.inputData })


        // saveDataToJson(await parseDataFromSheet({sheet: "certificado", inputs: ["data", "nome_evento", "nome", "matricula"]}), "certificado.json")

        // saveDataToJson(await parseDataFromSheet({sheet: "inscricao", inputs: ["data", "nome_evento", "nome", "matricula"]}), "inscricao.json")

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
