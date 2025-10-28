const axios = require("axios");
const fsSync = require("fs");
const path = require("path");

const {createDirectory} = require('./FileHelper');
const logger = require("./Logger");

const url = process.env.EXECUTABLE_URL_DOWNLOAD;
const destFolder = process.env.EXECUTABLE_LOCAL_FOLDER || "teste";
const destFile = path.join(destFolder, process.env.EXECUTABLE_LOCAL_NAME || "teste");


async function handleDownloadExecutableWithVersioning() {
    // Colocar a lógica que verifica se a versão local é igual à versão remota
    await downloadExecutable(); // #TODO: Melhorar essa lógica
}


async function downloadExecutable() {
    const dir = path.dirname(destFolder);
    createDirectory(dir)

    logger.info(`Baixando arquivo de ${url}...`);

    const writer = fsSync.createWriteStream(destFile);
    const response = await axios({
        method: "get",
        url: `${url}?v=${Date.now()}`, // cache buster
        responseType: "stream" }
    );

    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", () => {
            logger.info(`Arquivo salvo em: ${destFile}`);
            resolve();
        });
        writer.on("error", (err) => {
            logger.info("Falha ao salvar o arquivo.");
            reject(err);
        });
    });
}


module.exports = {
    downloadExecutable,
    handleDownloadExecutableWithVersioning
}