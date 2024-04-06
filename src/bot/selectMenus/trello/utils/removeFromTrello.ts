/* import { env } from "@/env";
import { editSucessReply } from '@/bot/utils/discord/editSucessReply';
import { editErrorReply } from '@/bot/utils/discord/editErrorReply';
import { getAllMembersInfo } from "@/bot/utils/trello/getAllMembersInfo";
import { left, right } from "@/api/@types/either";

export default async function removeFromTrello(email: string) {
        const memberToBeRemovedId = "pedro.melopedromelo@outlook.com.br";
        console.log("memberToBeRemoved", memberToBeRemovedId);

        try {

        }

        const boardId = env.TRELLO_BOARD_ID;
        const boardIds = [ boardId ];

        const memberToBeRemoved = await (await getAllMembersInfo(boardId)).filter(member => member.id === memberToBeRemovedId)[0];

        const admBoardId = env.TRELLO_ADM_BOARD_ID;
        const memberToBeRemoved_ADM = await (await getAllMembersInfo(admBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_ADM) boardIds.push(admBoardId);

        const devBoardId = env.TRELLO_DEV_BOARD_ID;
        const memberToBeRemoved_DEV = await (await getAllMembersInfo(devBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_DEV) boardIds.push(devBoardId);

        const eventosBoardId = env.TRELLO_EVENTOS_BOARD_ID;
        const memberToBeRemoved_EVENTOS = await (await getAllMembersInfo(eventosBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_EVENTOS) boardIds.push(eventosBoardId);

        const marketingBoardId = env.TRELLO_MARKETING_BOARD_ID;
        const memberToBeRemoved_MARKETING = await (await getAllMembersInfo(marketingBoardId)).filter(member => member.id === memberToBeRemovedId)[0];
        if(memberToBeRemoved_MARKETING) boardIds.push(marketingBoardId);

        const fetchPromises: Promise<Response>[] = [];

        // Execute fetch for each boardId in parallel
        boardIds.forEach(boardId => {
            fetchPromises.push(
                fetch(`https://api.trello.com/1/boards/${boardId}/members/${memberToBeRemovedId}?key=${env.TRELLO_API_KEY}&token=${env.TRELLO_ACCOUNT_TOKEN}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .catch(error => {
                    console.error(`Error removing member from board ${boardId}:`, error);
                    return Promise.reject(error);
                })
            );
        });

        // Await all fetch operations
        try {
            await Promise.all(fetchPromises);
            console.log("Removing ==================================")
            return right("Membro deletado com sucesso");
        }
        catch(error) {
            console.error("Error in fetch operation");
            return left("Error deleting the member");
        }
} */