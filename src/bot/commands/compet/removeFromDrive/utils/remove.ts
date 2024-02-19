import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

const caminho = path.resolve(__dirname, 'auth.json');


interface AuthCredentials {
    type: string,
    project_id: string,
    private_key_id: string,
    private_key: string,
    client_email: string,
    client_id: string,
    auth_uri: string,
    token_uri: string,
    auth_provider_x509_cert_url: string,
    client_x509_cert_url: string,
    universe_domain: string
};

function getAuthCredentials(caminho:string): AuthCredentials | null {
    try {
        const jsonString: string = fs.readFileSync(caminho, 'utf-8');;
        const data: AuthCredentials = JSON.parse(jsonString);
        return data;
    } catch (error) {
        console.log("Erro ao ler o arquivo ", error);
        return null;
    }
}

export async function removeFromDrive(email:string) {
    const credentials = getAuthCredentials(caminho);
    const escopo = ['https://www.googleapis.com/auth/drive'];

    if(!credentials) {
        console.log("ACABOU!!");
        return false;
    }

    const auth = new google.auth.JWT(
        credentials?.client_email,
        undefined,
        credentials?.private_key,
        escopo
    );

    const drive = google.drive({
        version: 'v3',
        auth
    });

    const folderId = '1_jpIK2DNmJ75e-3f3Go9vSNO_kozos3K';
    
    drive.permissions.list({
        fileId: folderId,
        fields: 'permissions(id, emailAddress)',
    }, (err, res) => {
        if (err) {
            console.log("Erro ao lista permissões: ", err);
            return false;
        }

        const permissions = res?.data.permissions;
        if (permissions && permissions.length) {
            // Verificando se email passado como parametro tem acesso ao folder
            const userPermission = permissions.find((permissions: any) => permissions.emailAddress === email);

            if (userPermission) {
                // Removendo permissão de acesso do usuário expecífico
                if(userPermission.id) {
                    drive.permissions.delete({
                        fileId: folderId,
                        permissionId: userPermission.id,
                    }, (err, _) => {
                        if (err) {
                            console.log("Erro ao remover permissão: ", err);
                            return false;
                        }
                        console.log(`Acesso de ${email} foi removido com sucesso`);
                        return true;
                    });
                }
            }
        } else {
            console.log(`o ${email} não possui acesso a esse folder`);
            return false;
        }
    })
}