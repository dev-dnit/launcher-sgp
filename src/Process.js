const { exec, spawn } = require("child_process");
const path = require('path');
const logger = require("./Logger");
const {readEnvironmentVariablesLocally} = require("./FileHelper");


let VARIAVEIS_AMBIENTE = null;



const getVariavelAmbiente = (env) => {
  return VARIAVEIS_AMBIENTE[env];
}



/**
 * Checks if it's necessary to update the env vars
 * @param {boolean} forceUpdate
 * @returns {Promise<void>}
 */
async function updateEnvs(forceUpdate) {
  if (forceUpdate || !VARIAVEIS_AMBIENTE) {
    logger.info(`Atualizando variaveis de ambiente...`)

    VARIAVEIS_AMBIENTE = JSON.parse(await readEnvironmentVariablesLocally());
  }
}




/**
 * Stops the running process by name
 * @param {string[]} env - Environment name (e.g. 'hml', 'prd')
 * @returns {Promise<void>} Promise that resolves after stopping the process
 */
async function stopProcess(env) {
  logger.info(`Procurando por processos para encerrar...`);

  return new Promise((resolve) => {
    const killPromises = env.map(e => {
      return new Promise((res) => {
        const variaveis = getVariavelAmbiente(e);
        const processName = variaveis["SGP_EXECUTAVEL_NOME"];

        logger.info(`[${e}] Finalizando executável: ${processName}`);

        exec(`taskkill /F /IM ${processName}`, (error, stdout, stderr) => {

          if (error && stderr.includes("foi encontrado")) {
            logger.info(`[${e}] Nenhum processo em execução encontrado para encerrar.`);

          } else if (error) {
            logger.info(`[${e}] Erro ao tentar encerrar o processo: ${stderr}`);

          } else {
            logger.info(`[${e}] Processos antigos encerrados com sucesso.`);
          }

          setTimeout(res, 5000);
        });
      });
    });

    Promise.all(killPromises).then(resolve);
  });
}



/**
 * Starts a new process with the specified environment variables
 * @param {string[]} env - Environment variables to pass to the process
 * @returns {Promise<void>} Promise that resolves after starting the process
 */
async function startProcess(env) {
  env.forEach(e => {
    try {
      const variaveis = getVariavelAmbiente(e);
      const destFile = path.join(variaveis["SGP_PASTA_RAIZ"], variaveis["SGP_EXECUTAVEL_NOME"]);

      logger.info(`[${e}] Iniciando execução do SGP: ${destFile}`);

      const sgpProcess = spawn(destFile, [], {
        detached: true,
        stdio: "ignore",
        shell: true,
        env: {...variaveis},
        cwd: path.dirname(destFile),
      });
      sgpProcess.unref();

      logger.info(`[${e}] SGP iniciado com sucesso em segundo plano com PID: ${sgpProcess.pid}.`);

    } catch (error) {
      logger.error(`[${e}] Falha ao iniciar o SGP: ${error.message}`);
    }
  })
}



module.exports = {
  startProcess,
  stopProcess,
  updateEnvs,
  getVariavelAmbiente,
};
