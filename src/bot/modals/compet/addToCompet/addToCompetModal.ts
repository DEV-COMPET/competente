import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { TextInputComponentData, ModalComponentData } from "discord.js";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

import { inserirInfoSheets } from "./utils/inserirInfo";
import { extractInputData } from "./utils/extractInputData";
import { createSelectMemberMenu } from "./utils/createSelectMemberMenu";
import { socialMedia } from "@/bot/commands/compet/addToCompet/addToCompet";
import { shareDrive } from "./utils/acessDrive";


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

        const inputData = extractInputData({ inputFields, interaction });
        const { instagram, linkedin } = socialMedia;

        await inserirInfoSheets(inputData.nome, inputData.telefone, inputData.email, instagram, linkedin);
        await shareDrive(inputData.email);

        await editLoadingReply({
            interaction,
            title: "Dados recolhido, adicionando as devidas plataformas..."
        });


        const guild = interaction.guild;
        if(!guild)
            throw "Guild not cached";

        const members = await guild.members.fetch();
        if (!members)
            throw "No members in this server";

        const membersData: MemberData[] = members.map(member => {
            const { id, globalName, username } = member.user;

            return { id, nickName: globalName ?? "", username };
        });

        const selectMemberMenu = createSelectMemberMenu({ membersData });

        await interaction.editReply({
            content: "Selecione o perfil do competiano que acabou de adicionar",
            components: [await makeStringSelectMenuComponent(selectMemberMenu)]
        })
    }
})

export { addToCompetModal }