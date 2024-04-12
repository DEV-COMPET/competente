import { env } from "@/env";
import { TrelloMember } from "./TrelloTypes";

function validateName(name: string): boolean {
    // Regular expression to match special characters at the beginning of the string
    const specialCharsRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    // Check if the first character of the name matches the regex
    return !specialCharsRegex.test(name[0]);
}


export async function getAllMembersInfo(boardId: string) {
    const APIkey = env.TRELLO_API_KEY;
    const token = env.TRELLO_ACCOUNT_TOKEN;
    
    try {
        const response = await fetch(`https://api.trello.com/1/boards/${boardId}/members?key=${APIkey}&token=${token}`, {
            method: 'GET'
        });

        if(!response.ok)
            throw new Error('Trello Get All Members Names Error');

        const membersInfo: TrelloMember[] = await response.json();
        const membersNames = membersInfo.map(member => ({ fullName: member.fullName, id: member.id }))
                                .filter(member => validateName(member.fullName));
        return membersNames;
    }
    catch(error) {
        console.error("Trello Get All Members Error", error);
        throw error;
    }
}