import { google } from "googleapis";
import { partial_to_full_path, readJsonFile } from "@/bot/utils/json";
import fs from "fs";
import { env } from "@/env";
import { Either, left, right} from "@/api/@types/either";
import { GoogleError } from "@/bot/errors/googleError";

// async function removeFromDrive() {
//     const auth = new google.auth.GoogleAuth({
//         keyFile: partial_to_full_path({
//             dirname: __dirname,
//             partialPath: `../../../utils/googleAPI/competente.${env.ENVIRONMENT}.json`
//         }),
//         scopes: 'https://www.googleapis.com/auth/drive',
//     });

//     const service = google.drive({ version: 'v3', auth});

//     const folderId = "0B5QTELWgXQ5DfnY0Snl1Zl9STWF0OEVLTzZKeWlPazNKTnluZTdwLVRTUnJCcmhiOXlFZkk"


// }

import { Command } from "@/bot/structures/Command"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { TextInputComponentData, ModalComponentData}  from "discord.js"
import { makeModal } from "@/bot/utils/modal/makeModal"




export default new Command ({
    name: "remove-from-drive",
    description: "Remove permissão de acesso de uma pessoa do drive",
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const { inputFields, modalBuilderRequest }: {
            inputFields: TextInputComponentData[];
            modalBuilderRequest: ModalComponentData;
        } = readJsonFile({ dirname: __dirname, partialPath: 'removeFromDriveData.json'});

        const removeEmailModal = makeModal(inputFields, modalBuilderRequest);
        console.log("Chego aqui")
        await interaction.showModal(removeEmailModal);
        
    },
})