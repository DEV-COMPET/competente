import { env } from '@/env';
import { TextInputComponentData, ModalComponentData, ComponentType } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import fetch from "node-fetch";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from '@/bot/utils/modal/makeSelectMenu';
import { customId, options, minMax } from './../../../selectMenus/trello/selectTeam.json';
import { memberEmail } from './utils/memberEmail';

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'addMemberToTrello.json' });

const addMemberToTrelloModal = makeModal(inputFields, modalBuilderRequest);
let export_email: string;

export default new Modal({
    customId: "addmembertotrello",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";
        await interaction.deferReply({ ephemeral: true })

        const { email } = extractInputData({ inputFields, interaction });
        const validateInputDataResponse = await validateInputData({ email });
        
        if (validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                error: validateInputDataResponse.value.error, interaction,
                title: "Não foi possível adicionar o competiano ao Trello"
            });
        }
        
        export_email = email;

        const bodyData = `{
        "fullName": "<string>"
        }`;

        fetch(`https://api.trello.com/1/boards/${env.TRELLO_BOARD_ID}/members?key=${env.TRELLO_API_KEY}&token=${env.TRELLO_ACCOUNT_TOKEN}&email=${email}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyData
        })
        .then(response => {
            if(response.status == 200) {
                return response.text(); 
            }
            else throw new Error(response.statusText);
        })
        .then(async text => {
            const teamMenu = makeStringSelectMenu({
                customId,
                type: ComponentType.StringSelect,
                options,
                maxValues: minMax.max,
                minValues: minMax.min
            });

            memberEmail.push(text);

            await interaction.editReply({
                content: 'Selecione a equipe do novo membro',
                components: [await makeStringSelectMenuComponent(teamMenu)]
            });

            return editSucessReply({
                interaction, title: "Competiano adicionado ao Trello Geral do COMPET!",
                fields: [
                    {
                        name: "E-mail",
                        value: email,
                        inline: false
                    },
                ],
            });
        })
        .catch(err => {
            return editErrorReply({
                error: err, interaction,
                title: "Não foi possível adicionar o competiano ao Trello"
            });
        });
    },
});

export { addMemberToTrelloModal, export_email };
