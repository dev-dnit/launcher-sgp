require("dotenv").config({ path: "./.env" });
const express = require("express");
const logger = require("./src/Logger");
const {runUpdateFlow} = require("./src/UpdateFlow");

logger.info(process.env)
console.log("process")
console.log(process.env)

const API_HOST = process.env.API_HOST || "http://localhost";
const API_PORT = process.env.API_PORT || 3080;

const app = express();

// Helper to run the update flow safely
async function handleUpdate(res, force = false) {
    try {
        await runUpdateFlow(force);
        const type = force ? "forçada" : "padrão";
        res.status(202).json({message: `Processo de atualização ${type} iniciado.`});
    } catch (error) {
        logger.error("Erro ao executar a atualização:", error);
        res.status(500).json({message: "Falha ao iniciar o processo de atualização."});
    }
}


// Routes
app.get("/update", (req, res) => {
    logger.info("Solicitado atualização padrão do SGP");
    handleUpdate(res, false);
});


app.get("/force-update", (req, res) => {
    logger.info("Solicitado atualização forçada do SGP");
    handleUpdate(res, true);
});


app.get("/status", (req, res) => {
    res.status(200).json({status: "SGP Launcher API está online."});
});


// Start server
app.listen(API_PORT, async () => {
    logger.info(`Servidor do SGP Launcher rodando na porta ${API_PORT}`);
    logger.info(`Para atualizar, acesse ${API_HOST}:${API_PORT}/update`);
    logger.info(`Para forçar a atualização, acesse ${API_HOST}:${API_PORT}/force-update`);
    logger.info(`Para verificar o status, acesse ${API_HOST}:${API_PORT}/status`);

    logger.info("Executando verificação inicial ao iniciar o serviço...");
    try {
        await runUpdateFlow(true);
        logger.info("Verificação inicial concluída com sucesso.");
    } catch (error) {
        logger.error("Erro na verificação inicial:", error);
    }
});
