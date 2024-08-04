import { Button } from "@/bot/structures/Button";
import { makeSuccessButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { ButtonStyle } from "discord.js";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "confirmButtonCertificateInput.json"
});

export const confirmButtonCertificateTalks = makeSuccessButton({ customId, label });

export default new Button({
    customId,
    label,
    style: ButtonStyle.Success,
    run: async ({ interaction }) => {
        console.log("Now it's button")
        await interaction.deferReply();
        await interaction.editReply({ content: 'Certificados gerados com sucesso!', components: [] });
    }
});