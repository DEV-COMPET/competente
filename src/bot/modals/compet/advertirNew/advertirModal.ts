import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { Either, left, right } from "@/api/@types/either";
import { membroASerAdvertidoSelecionado } from "@/bot/selectMenus/advertir/advertirSelectMenu";
import { CompetianoType } from "@/api/modules/competianos/entities/competiano.entity";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'advertirModalData.json' });

const advertirModalNew = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: modalBuilderRequest.customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const { motivo } = extractInputData({ interaction, inputFields })

        const membro$Email = membroASerAdvertidoSelecionado[membroASerAdvertidoSelecionado.length - 1].split("$$$")

        const advertirResponse = await advertir({ advertido: {
            motivo, nome: membro$Email[0], email: membro$Email[1]
        }   })
        if (advertirResponse.isLeft())
            return await editErrorReply({
                error: advertirResponse.value.error,
                interaction, title: "Não foi possivel advertir os membros"
            })

        // const sendWarningEmailsToCompetianosResponse = await sendWarningEmailsToCompetianos({
        //     advertidos: advertirResponse.value.advertidos,
        //     motivos: validateInputDataResponse.value.inputData.motivos
        // })
        // if (sendWarningEmailsToCompetianosResponse.isLeft())

        //     // TODO: remover advertência do banco de dados

        //     return await editErrorReply({
        //         error: sendWarningEmailsToCompetianosResponse.value.error, interaction, title: "Não foi possível enviar emails para advertidos"
        //     })

        // COMENTADA PARA NÃO CORRER RISCCO DE ENVIAR EMAILS ERRADOS PARA TUTORES

        /*
                const sendWarningEmailsToTutorsResponse = await sendWarningEmailsToTutors({ advertidos: advertirResponse.value.advertidos })
                if (sendWarningEmailsToTutorsResponse.isLeft())
                    return editErrorReply({
                        error: sendWarningEmailsToTutorsResponse.value.error, interaction, title: "Não foi possível enviar emails para tutores"
                    })
        */

        return await editSucessReply({
            interaction, title: `Membro advertido com sucesso:\n\n${advertirResponse.value.advertido.nome}`
        })
    }
});

export { advertirModalNew };

// =================================================================================================================

interface ExtractInputDataRequest {
    interaction: ExtendedModalInteraction,
    inputFields: TextInputComponentData[]
}

export interface ExtractInputDataResponse {
    motivo: string
}

export function extractInputData({ inputFields, interaction }: ExtractInputDataRequest): ExtractInputDataResponse {
    const customIds = inputFields.map((field) => field.customId || "");
    const input_data = customIds.map(i => ({ [i]: interaction.fields.getTextInputValue(i) }));

    interface InputFieldsRequest {
        motivo: string
    }

    const { motivo }: InputFieldsRequest = Object.assign({}, ...input_data);

    return { motivo }
}

// =================================================================================================================

export type AdvertidoType = {
    nome: string; 
    motivo: string;
    email: string
}

interface AdvertirRequest {
    advertido: AdvertidoType
}

type AdvertirResponse = Either<
    { error: FetchReponseError },
    { advertido: AdvertidoType }
>

export async function advertir({ advertido }: AdvertirRequest): Promise<AdvertirResponse> {

    const getRequestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const getMemberUrl = `http://localhost:3000/competianos/${advertido.nome}`

    const getMemberResponse = await fetch(getMemberUrl, getRequestOptions);
    if (!(getMemberResponse.status >= 200 && getMemberResponse.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await getMemberResponse.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const membro: CompetianoType = await getMemberResponse.json();
    membro.advertenciasArr.push(advertido.motivo)

    const updateRequestOptions = {
        method: "put",
        body: JSON.stringify({ membro }),
        headers: { "Content-Type": "application/json" },
    };

    const updateMemberUrl = `http://localhost:3000/competianos/${advertido.nome}`

    const updateMemberResponse = await fetch(updateMemberUrl, updateRequestOptions);
    if (!(updateMemberResponse.status >= 200 && updateMemberResponse.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await updateMemberResponse.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    console.log(advertido.nome + " advertido")

    return right({ advertido })
}

// =================================================================================================================