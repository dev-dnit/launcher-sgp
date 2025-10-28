const logger = require("./Logger");
const {
  downloadExecutable,
  handleDownloadExecutableWithVersioning,
} = require("./Downloader");
const { startProcess, stopProcess } = require("./Process");

let isUpdateRunning = false;

async function runUpdateFlow(forcedUpdate = true) {
  if (isUpdateRunning) {
    logger.warn("Já existe um processo de atualização em andamento.");
    return;
  }
  isUpdateRunning = true;

  const flowType = forcedUpdate ? "forçada" : "padrão";
  logger.info(`Iniciando fluxo de atualização ${flowType}...`);

  try {
    await stopProcess();

    let envVars;
    if (forcedUpdate) {
      envVars = await handleDownloadExecutableWithVersioning(true);
    } else {
      aenvVars = await handleDownloadExecutableWithVersioning(false);
    }

    await startProcess(envVars);
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
