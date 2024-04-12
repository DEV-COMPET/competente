import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { extractInputData } from "./utils/extractInputData";
// import interactionCreate from "@/bot/events/interactionCreate";
import { validateInputData } from "./utils/validateInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'removeFromTrello.json' });

const removeFromTrelloModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "removefromtrello",

    run: async ({ interaction }) => {
        if(interaction.channel === null)
            throw "Channel is not cached";
        await interaction.deferReply({ ephemeral: true });

        const { username } = extractInputData({ inputFields, interaction });

        const validateInputDataResponse = await validateInputData({ username });
        if(validateInputDataResponse.isLeft()) {
            return await editErrorReply({
                error: validateInputDataResponse.value.error, interaction,
                title: "Não foi possível remover o membro do Trello"
            });
        }

        fetch('https://api.trello.com/1/boards/EHISYWtc/members?key=9fbd93571f3419b52bb337324d0fb72f&token=ATTA565430860ae464d902f57b17c96a2737f6b79ac33077f63b147ee6ab67e828253796F1BB', {
            method: 'GET'
        })
        .then(response => {
            console.log(
            `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => JSON.parse(text))
        .then(users => {
            let id = undefined;

            for(const user of users) {
                if(user.username === username) {
                    id = user.id;
                    break;
                }
            }

            return id;
        })
        .then(id => {
            if(id === undefined) {
                return editErrorReply({
                    error: new Error('username not found'), interaction,
                    title: `Não há nenhum usuário com o username ${username} no board do Trello`
                });
            }
            else {
                fetch(`https://api.trello.com/1/boards/EHISYWtc/members/${id}?key=9fbd93571f3419b52bb337324d0fb72f&token=ATTA565430860ae464d902f57b17c96a2737f6b79ac33077f63b147ee6ab67e828253796F1BB`, {
                method: 'DELETE'
                })
                .then(response => {
                    console.log(
                    `Response: ${response.status} ${response.statusText}`
                    );
                    return response.text();
                })
                .then(text => {
                    return editSucessReply({
                        interaction, title: "Membro removido do Trello!",
                        fields: [
                            {
                                name: "Username",
                                value: username,
                                inline: false
                            },
                            {
                                name: "Id",
                                value: id,
                                inline: false
                            }
                        ],
                    });
                })
                .catch(err => {
                    return editErrorReply({
                        error: err, interaction,
                        title: "Não foi possível remover o membro do Trello"
                    });
                });
            }
        })
        .catch(err => {
            return editErrorReply({
                error: err, interaction,
                title: "Não foi possível remover o membro do Trello"
            });
        });
    }
});

export { removeFromTrelloModal };