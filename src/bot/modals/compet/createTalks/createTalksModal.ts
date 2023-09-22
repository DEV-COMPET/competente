import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { env } from "@/env";
import { makeErrorEmbed } from "@/bot/utils/embed/makeErrorEmbed";
import { Either, left, right } from "@/api/@types/either";
import { InvalidInputLinkError } from "@/bot/errors/invalidInputError";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { Talks } from "@/api/modules/talks/entities/talks.entity";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'createTalksModalData.json' });

const createTalksModal = makeModal(inputFields, modalBuilderRequest);

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

        const createTalksInDatabaseResponse = await createTalksInDatabase(inputData)
        if (createTalksInDatabaseResponse.isLeft())
            return await interaction.editReply({
                embeds: [
                    makeErrorEmbed({
                        title: "Não foi possivel enviar o talks para o Banco de Dados",
                        error: { code: 401, message: createTalksInDatabaseResponse.value.error.message },
                        interaction,
                    })
                ]
            })

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Até o momento tamo sussa.",
                    interaction
                })
            ]
        })
    }
});


async function createTalksInDatabase(inputData: ExtractInputDataResponse): Promise<CreateTalksInDatabaseResponse> {

    const requestOptions = {
        method: "post",
        body: JSON.stringify(inputData),
        headers: { "Content-Type": "application/json" },
    };

    const APIurl = env.ENVIRONMENT === "development" ? "http://localhost:4444/talks/" : `${env.HOST}/talks/` || "http://localhost:4444/talks/";

    const response = await fetch(APIurl, requestOptions);

    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const createdTalks: Talks = await response.json()

    return right({ createdTalks })

}

type CreateTalksInDatabaseResponse = Either<
    { error: FetchReponseError },
    { createdTalks: Talks }
>


function validateInputData({ data, palestrantes, titulo }: ExtractInputDataResponse): ValidateInputDataResponse {

    if (!(titulo.includes("COMPET Talks")))
        return left({ error: new InvalidInputLinkError(["titulo"]) })

    return right({ inputData: { data, palestrantes, titulo } })
}

type ValidateInputDataResponse = Either<
    { error: InvalidInputLinkError },
    { inputData: ExtractInputDataResponse }
>

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        palestrantes: string
        titulo: string
        data: string
    }

    const { palestrantes, titulo, data }: InputFieldsRequest = Object.assign({}, ...input_data);

    const palestrantes_separados = palestrantes.split(',').map(nome => { return nome.trim() })

    return { palestrantes: palestrantes_separados, data, titulo }
}

interface ExtractInputDataResponse {
    palestrantes: string[]
    titulo: string
    data: string
}

export { createTalksModal };
