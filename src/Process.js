const {exec, spawn} = require("child_process");
const path = require("path");
const logger = require("./Logger");

const processName = process.env.EXECUTABLE_LOCAL_NAME;
const destFile = path.join(process.env.EXECUTABLE_LOCAL_FOLDER, process.env.EXECUTABLE_LOCAL_NAME);


async function stopProcess() {
    logger.info(`Procurando por processos '${processName}' para encerrar...`);
    return new Promise((resolve) => {
        exec(`taskkill /F /IM ${processName}`, (error, stdout, stderr) => {
            if (error && stderr.includes("foi encontrado")) {
                logger.info("Nenhum processo em execução encontrado.");
            } else if (error) {
                logger.error(`Erro ao tentar encerrar o processo: ${stderr}`);
            } else {
                logger.info("Processos antigos encerrados com sucesso.");
            }
            setTimeout(resolve, 5_000);
        });
    });
}


function startProcess() {
    logger.info(`Iniciando o processo: ${destFile}`);
    try {
        const exe = path.dirname(destFile);
        const sgpProcess = spawn(destFile, [], {
            detached: true,
            stdio: "ignore",
            shell: true,
            env: {...process.env},
            cwd: exe,
        });
        sgpProcess.unref();
        logger.info(`SGP iniciado com sucesso em segundo plano com PID: ${sgpProcess.pid}.`);

    } catch (error) {
        logger.error(`Falha ao iniciar o SGP: ${error.message}`);
    }
}

module.exports = {
    startProcess,
    stopProcess,
}