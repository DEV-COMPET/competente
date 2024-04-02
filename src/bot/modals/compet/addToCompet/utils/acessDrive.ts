import { partial_to_full_path } from "@/bot/utils/json";
import { google } from "googleapis";

export async function shareDrive(email: string) {

      const auth = new google.auth.GoogleAuth({
        keyFile: partial_to_full_path({
            dirname: __dirname,
            partialPath: "credentials.json"
        }),
        scopes: "https://www.googleapis.com/auth/drive"
      });

      const drive = google.drive({ version: "v3", auth});
      const permissionId = [];
      const folderId = "1_jpIK2DNmJ75e-3f3Go9vSNO_kozos3K";

      const permissions = [
            {
                  type: "user",
                  role: "writer",
                  emailAddress: `${email}`,
            },
      ]

      for (const permission of permissions) {
            try {
                  const result = await drive.permissions.create({
                        fileId: folderId,
                        sendNotificationEmail: true,
                        emailMessage: "Seja bem vindo a pasta ...",
                        requestBody: permission,
                        fields: "id"
                  });
                  console.log(`Email de permissão: ${result.data.emailAddress}`);
            } catch (error) {
                  console.error(error);
            }
      }
}

// shareDrive();