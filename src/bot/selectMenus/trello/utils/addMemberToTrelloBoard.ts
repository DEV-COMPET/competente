import { env } from '@/env';

export default async function addMemberToTrelloBoard(trelloBoardID: string, email: string) {
    const bodyData = `{
        "fullName": "<string>"
        }`;
    fetch(`https://api.trello.com/1/boards/${trelloBoardID}/members?key=${env.TRELLO_API_KEY}&token=${env.TRELLO_ACCOUNT_TOKEN}&email=${email}`,{
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
        .then(text => async () => {
            console.log(text);

            return { status: "OK" };
        })
        .catch(err => { throw err });
}

