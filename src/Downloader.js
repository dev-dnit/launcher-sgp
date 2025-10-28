const axios = require("axios");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { createDirectory, fileExists } = require("./FileHelper");
const logger = require("./Logger");

const {
  REMOTE_CONFIG_URL,
  GITHUB_TOKEN,
  EXECUTABLE_URL_DOWNLOAD,
  EXECUTABLE_LOCAL_FOLDER,
  EXECUTABLE_LOCAL_NAME,
} = process.env;

const destFile = path.join(EXECUTABLE_LOCAL_FOLDER, EXECUTABLE_LOCAL_NAME);

async function handleDownloadExecutableWithVersioning(forceUpdate = false) {
  if (forceUpdate) {
    await downloadExecutable()
    return []
  }
  // #TODO: Corrigir jaja essa logica para tbm baixar o configLocal e funcionar
  await downloadExecutable()
  return [];
}


async function updateLocalVersion() {
  const urlWithAuth = `${REMOTE_CONFIG_URL}?token=${GITHUB_TOKEN}`;
  const urlWithCacheBuster = `${urlWithAuth}&v=${Date.now()}`;

  console.log(`urlWithCacheBuster:${urlWithCacheBuster}`)
  const response = await axios.get(urlWithCacheBuster);
  const remoteConfig = response.data;
  logger.info(`Versão remota encontrada: ${remoteConfig.version}`);

  const localConfigPath = path.join(
      EXECUTABLE_LOCAL_FOLDER,
      "local_config.json"
  );
  let localVersion = "0.0.0";

  if (await fileExists(localConfigPath)) {
    try {
      const localConfigFile = await fs.readFile(localConfigPath, "utf-8");
      localVersion = JSON.parse(localConfigFile).version;
    } catch (e) {
      logger.warn(`Aviso: Falha ao ler JSON local. Erro: ${e.message}`);
    }
  }
  logger.info(`Versão local encontrada: ${localVersion}`);

  if (remoteConfig.version !== localVersion || !(await fileExists(destFile))) {
    logger.info("Atualização necessária. Iniciando download...");
    await downloadExecutable(remoteConfig.executable.url);
    await fs.writeFile(localConfigPath, JSON.stringify(remoteConfig, null, 2));
    logger.info(
        `Configuração local atualizada para a versão ${remoteConfig.version}`
    );
  } else {
    logger.info("Nenhuma atualização de executável necessária.");
  }

  return remoteConfig.environment_variables;
}



async function downloadExecutable() {
  const url = EXECUTABLE_URL_DOWNLOAD;
  createDirectory(EXECUTABLE_LOCAL_FOLDER);

  logger.info(`Baixando arquivo de ${url}...`);

  const writer = fsSync.createWriteStream(destFile);
  const response = await axios({
    method: "get",
    url: `${url}?v=${Date.now()}`, // cache buster
    responseType: "stream",
  });

  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      logger.info(`Arquivo salvo em: ${destFile}`);
      resolve();
    });
    writer.on("error", (err) => {
      logger.error("Falha ao salvar o arquivo.", err);
      reject(err);
    });
  });
}


module.exports = {
  downloadExecutable,
  handleDownloadExecutableWithVersioning,
};
