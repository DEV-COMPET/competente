import { env } from '@/env';

export default async function addMemberToTrelloBoard(trelloBoardID: string, email: string) {
    const bodyData = JSON.stringify({
        "fullName": "<string>"
    });

    const response = await fetch(`https://api.trello.com/1/boards/${trelloBoardID}/members?key=${env.TRELLO_API_KEY}&token=${env.TRELLO_ACCOUNT_TOKEN}&email=${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyData
    });

    if (response.ok) {
        // const text = await response.text();
        return { status: "OK" };
    } else {
        throw new Error(response.statusText);
    }
}
