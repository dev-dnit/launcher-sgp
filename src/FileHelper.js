const logger = require('./Logger');
const fsSync = require('fs');
const fs = require('fs').promises;
const path = require('path');

const mainFile = require.main.filename;
const DEST_FILE = path.join(path.dirname(mainFile), 'variaveis.json');


/**
 * Utility to check if a file exists
 * @param {string} filePath
 */
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}



/**
 * Function to create directory
 * @param {string} folderToCreate
 */
function createDirectory(folderToCreate) {
    const dirPath = path.resolve(folderToCreate);

    try {
        if (!fsSync.existsSync(dirPath)) {
            logger.info(`Criando diretório: ${folderToCreate}`);
            fsSync.mkdirSync(dirPath, {recursive: true});
        }
    } catch (e) {
        logger.error(`Erro ao criar diretório: ${dirPath}`, e);
        throw e;
    }
}



/**
 * Read the environment variables for the SGP.
 * @returns {Promise<string>}
 */
async function readEnvironmentVariablesLocally() {
  const exists = await fileExists(DEST_FILE);
  if (!exists) {
    throw new Error(`Nao foi encontrado o arquivo de variaveis em: ${DEST_FILE}`);
  }

  logger.info(`Lendo variáveis do arquivo existente: ${DEST_FILE}`);
  return await fs.readFile(DEST_FILE, "utf8");
}



module.exports = {
    createDirectory,
    readEnvironmentVariablesLocally,
};
