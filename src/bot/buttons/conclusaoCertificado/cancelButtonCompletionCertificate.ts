import { Button } from "@/bot/structures/Button";
import { makeCancelButton } from "@/bot/utils/button/makeButton";
import { readJsonFile } from "@/bot/utils/json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";

const { customId, label } = readJsonFile({
    dirname: __dirname,
    partialPath: "cancelButtonCompletionCertificateInput.json"
});

export const cancelButtonCompletionCertificate = makeCancelButton({ customId, label });

export default new Button({
    customId,
    run: async ({ interaction }) => {
        console.log("Button canceled completion certificate");
        await interaction.deferReply();

        return editErrorReply({ interaction, title: "Operação cancelada com sucesso!",
                                    error: new Error("O usuário cancelou a operação, pois alguma informação estava incorreta") });
    }
});