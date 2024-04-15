import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

import { extractInputData } from "./utils/extractInputData";
import { createSelectMemberMenu } from "./utils/createSelectMemberMenu";
import { socialMedia } from "@/bot/commands/compet/addToCompet/addToCompet";

import { acessDrive } from "@/bot/utils/googleAPI/googleDrive";
import { inserirInfoSheets } from "@/bot/utils/googleAPI/insertCompetianoInfo";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

export interface MemberData {
    id: string,
    nickName: string,
    username: string
}

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[],
    modalBuilderRequest: ModalComponentData
} = readJsonFile({ dirname: __dirname, partialPath: 'addToCompetData.json'})

const addToCompetModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal ({
    customId: 'add-to-compet',
    
    run: async ({ interaction }) => {
                
        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response;

        const { data } = extractInputData({ inputFields, interaction });

        
        
        const { nome, email, linkedin, data_inicio, url_imagem, lates } = data;
        const { telefone, instagram } = socialMedia;
        
        const validateInputDataResponse = await validateInputData({ data });
        if (validateInputDataResponse.isLeft())
            return await editErrorReply({
                    error: validateInputDataResponse.value.error, interaction,
                    title: "Não foi possível adicionar o competiano no banco de dados."
                });

        const inserirDadosInfoResponse = await inserirInfoSheets({ nome, telefone, email, instagram, linkedin, });
        if (inserirDadosInfoResponse.isLeft())
            return await editErrorReply({
                error: inserirDadosInfoResponse.value.error, interaction,
                title: "Não foi possível inserir competiano a planilha"
            });

        const acessDriveResponse = await acessDrive(data.email);
        if (acessDriveResponse.isLeft())
            return await editErrorReply({
                error: acessDriveResponse.value.error, interaction,
                title: "Erro ao permitir acesso ao drive do compet"
            });

        
        await editSucessReply({
            interaction, title: "Competiano criado com sucesso. Seja bem vindo!!",
            fields: [
                {
                    name: "Nome",
                    value: nome,
                    inline: false
                },
                {
                    name: "Data de início",
                    value: data_inicio.toString(),
                    inline: false
                },
                {
                    name: "Linkedin",
                    value: linkedin || " Nenhum linkedin informado",
                    inline: false,
                },
                {
                    name: "Email",
                    value: email,
                    inline: false
                },
                {
                    name: "Lattes",
                    value: lates || " Nenhum lattes informado",
                    inline: false
                },
                {
                    name: "Instagram",
                    value: instagram || "Nenhum instagram informado",
                    inline: false
                }
            ],
            url_imagem: url_imagem
        })

        const guild = interaction.guild;

        if (!guild) {
            return await  editLoadingReply({
                interaction,
                title: "Fazendo validação dos emails passados"
            });
        }    
        
        const members = await guild.members.fetch();
        
        const membersData: MemberData[] = members.map(member => {
            const { id, globalName, username } = member.user;

            return { id, nickName: globalName ?? "", username };

        });

        const selectMemberMenu = createSelectMemberMenu({ membersData });

        await interaction.editReply({
            content: "Selecione o perfil do competiano que acabou de adicionar",
            components: [await makeStringSelectMenuComponent(selectMemberMenu)]
        
        });
    }
})

export { addToCompetModal }