import { ComponentType, SelectMenuComponentOptionData, StringSelectMenuBuilder } from "discord.js";
import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu";
import { MemberData } from "../addToCompetModal";


import data from "@/bot/selectMenus/addToCompet/selectMemberMenuData.json";

interface createSelectMemberMenuRequest {
    membersData: MemberData[]
}

export function createSelectMemberMenu( { membersData }: createSelectMemberMenuRequest): StringSelectMenuBuilder {
    const options: SelectMenuComponentOptionData[] = membersData.map( member => {
        return {
            label: `${member.username} (${member.nickName})`,
            value: member.id
        }
    });

    const menu = makeStringSelectMenu({
        customId: data.customId,
        maxValues: data.minMax.max,
        minValues: data.minMax.min,
        type: ComponentType.StringSelect,
        options
    });

    return menu;
}