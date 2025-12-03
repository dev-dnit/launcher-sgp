const logger = require("./Logger");
const { startProcess, stopProcess, updateEnvs } = require("./Process");
const {handleDownloadExecutableWithVersioning} = require("./Downloader");


let isUpdateRunning = false;


/**
 * Executes the update flow for the application
 * @param {boolean} forcedUpdate - Whether to force the update regardless of version checking
 * @param {string[]} env - The type of update to perform
 * @returns {Promise<void>}
 */
async function runUpdateFlow(forcedUpdate, env) {
  if (isUpdateRunning) {
    logger.warn("Já existe um processo de atualização em andamento.");
    return;
  }

  isUpdateRunning = true;

  try {
    const flowType = forcedUpdate ? "forçada" : "padrão";
    logger.info(`Iniciando fluxo de atualização ${flowType}...`);

    await updateEnvs(forcedUpdate);
    await handleDownloadExecutableWithVersioning(forcedUpdate, env)
    await stopProcess(env);
    await startProcess(env);

  } catch (error) {
    logger.error(`Falha no fluxo de atualização: ${error.stack}`);

  } finally {
    isUpdateRunning = false;
    logger.info("Fluxo de atualização finalizado.");
  }
}



module.exports = {
  runUpdateFlow,
};
