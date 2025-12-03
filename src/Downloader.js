const axios = require("axios");
const fsSync = require("fs");
const path = require("path");
const {createDirectory} = require("./FileHelper");
const logger = require("./Logger");
const {getVariavelAmbiente} = require("./Process");


async function handleDownloadExecutableWithVersioning(forceUpdate, env) {
    if (!forceUpdate) {
        logger.info("Ignorando download dos executaveis")
        return;
    }
    for (const e of env) {
        logger.info(`[${e}] Iniciando download do executável SGP`)
        await downloadExecutable(e)
    }
}


async function downloadExecutable(e) {
    const variaveis = getVariavelAmbiente(e);

    const url = variaveis["EXECUTABLE_URL_DOWNLOAD"];
    const destFile = path.join(variaveis["SGP_PASTA_RAIZ"], variaveis["SGP_EXECUTAVEL_NOME"]);

    createDirectory(path.dirname(destFile));

    logger.info(`[${e}] Baixando arquivo executavel de ${url} para: ${destFile}`);

    const writer = fsSync.createWriteStream(destFile);
    const response = await axios({
        method: "get",
        url: `${url}?v=${Date.now()}`, // cache buster
        responseType: "stream",
    });

    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", () => {
            logger.info(`[${e}] Arquivo salvo em: ${destFile}`);
            resolve();
        });
        writer.on("error", (err) => {
            logger.error(`[${e}] Falha ao salvar o arquivo.`, err);
            reject(err);
        });
    });
}


module.exports = {
    handleDownloadExecutableWithVersioning,
};
