import { ComponentType, SelectMenuComponentOptionData, StringSelectMenuBuilder } from "discord.js";
import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu";
import { RoleData } from "../selectMemberMenu";

import data from "../selectTeam/selectTeamMenuData.json"

interface CreateTeamMenuRequest {
    rolesData: RoleData[]
}

export function createSelectRoleMenu({ rolesData }: CreateTeamMenuRequest): StringSelectMenuBuilder {
    
    const options: SelectMenuComponentOptionData[] = rolesData.map( role => {
        return { 
            label: `${role.name}`,
            value: `${role.name}`
        }
    });

    const menu = makeStringSelectMenu({
        customId: data.customId,
        minValues: data.minMax.min,
        maxValues: data.minMax.min,
        type: ComponentType.StringSelect,
        options
    });

    return menu;
}