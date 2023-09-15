import { exec } from 'child_process';

const isWin = process.platform === "win32";
const isLinux = process.platform === "linux";

let command = ""

if (isLinux)
    command = "rsync -r --include='*/' --include='*.json' --exclude='*' src/ dist/"

if (isWin)
    command = `robocopy src dist *.json /e`;

exec(command, (error, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
});
