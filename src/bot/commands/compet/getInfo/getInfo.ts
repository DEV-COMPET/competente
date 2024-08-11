import { Command } from "../../../structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./getInfoInput.json.json"
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { customId, minMax } from "@/bot/selectMenus/getTalksInfo/getInfoMenuData.json"
import { ComponentType } from "discord.js";
import { listPossibleSheetData } from "@/bot/selectMenus/getTalksInfo/utils/listPossibleSheetData";

export default new Command({
    name, description,
    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response

        const possibleInputs = await listPossibleSheetData({ choice: 'certificados' });

        const listTeamsToBeRemovedMenu = makeStringSelectMenu({
            customId: customId,
            type: ComponentType.StringSelect,
            options: possibleInputs.map(name => {
                return {
                    label: name,
                    value: name
                }
            }),
            maxValues: 5,
            minValues: minMax.min
        });

        await interaction.editReply({
            content: "Filtros Disponíveis:",
            components: [await makeStringSelectMenuComponent(listTeamsToBeRemovedMenu)],
        });
    },
});
