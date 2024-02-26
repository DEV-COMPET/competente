import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import fetch from "node-fetch";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'addMemberToTrello.json' });

const addMemberToTrelloModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "addmembertotrello",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";
        console.log("oi2");
        await interaction.deferReply({ ephemeral: true })

        const { email } = extractInputData({ inputFields, interaction });
        console.log("The email is", email);
        const validateInputDataResponse = await validateInputData({ email })
        if (validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                error: validateInputDataResponse.value.error, interaction,
                title: "Não foi possível adicionar o competiano ao Trello"
            });
        } 

        const bodyData = `{
        "fullName": "<string>"
        }`;

        fetch(`https://api.trello.com/1/boards/EHISYWtc/members?key=9fbd93571f3419b52bb337324d0fb72f&token=ATTA565430860ae464d902f57b17c96a2737f6b79ac33077f63b147ee6ab67e828253796F1BB&email=${email}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyData
        })
        .then(response => {
            console.log(
            `Response: ${response.status} ${response.statusText}`
            );

            if(response.status == 200)
                return response.text();
            else throw new Error(response.statusText);
        })
        .then(text => {
            console.log(text);
            return editSucessReply({
                interaction, title: "Competiano adicionado ao Trello!",
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

export { addMemberToTrelloModal };