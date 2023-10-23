import { Modal } from "@/bot/structures/Modals";
import { sucessReply } from "@/bot/utils/discord/editSucessReply";
import { inputsArr } from "./variables/inputs";
import { extractInputData } from "./utils/extractInputData";
import { saveDataToJson } from "@/bot/utils/googleAPI/getTalksInscriptions";
import { completeData } from "@/bot/selectMenus/getTalksInfo/variables/completeData";


/**
 * @author Pedro Augusto de Portilho Ronzani 
 * @description Advertir um membro do Compet.
 */

export default new Modal({
    customId: "get-talks-info",

    run: async ({ interaction }) => {

        const inputFields = inputsArr[inputsArr.length - 1]

        const data = extractInputData({ interaction, inputFields });

        const fullData = completeData[completeData.length - 1]

        const filtered = fullData.filter(item => {
            for (const key in data) {

                if (data[key] !== '' && data[key] !== item[key]) {
                    return false;
                }
            }
            return true;
        });

        await sucessReply({
            interaction, title: `${filtered.length} resultados registrados.`
        })

        saveDataToJson(filtered, 'jsons/talksdata/dados.json');
    }
});