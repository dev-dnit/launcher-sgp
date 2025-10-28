const logger = require('./Logger');
const fsSync = require('fs');
const path = require('path');

function createDirectory(dirPath) {
    dirPath = path.resolve(dirPath);

    try {
        if (!fsSync.existsSync(dirPath)) {
            logger.info(`Criando diretório: ${dirPath}`);
            fsSync.mkdirSync(dirPath, {recursive: true});
        }
    } catch (e) {
        logger.error(`Erro ao criar diretório: ${dirPath}`, e);
        throw e;
    }
}

module.exports = {
    createDirectory,
};
