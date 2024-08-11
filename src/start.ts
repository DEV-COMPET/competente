import { exec, ExecException } from 'child_process';

function startServer(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const serverProcess = exec(command);

        // Attach event listeners to stdout and stderr streams
        serverProcess.stdout?.on('data', (data: Buffer) => {
            console.log(data.toString());
        });

        serverProcess.stderr?.on('data', (data: Buffer) => {
            console.error(data.toString());
        });

        serverProcess.on('exit', () => {
            resolve();
        });

        serverProcess.on('error', (err: ExecException) => {
            reject(err);
        });
    });
}

async function startServers(): Promise<void> {
    try {
        console.log('Starting API server...');
        const sv = startServer('npm run api:start');

        console.log('Waiting for 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

        console.log('Starting bot server...');
        const bt = startServer('npm run bot:start');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

startServers();
