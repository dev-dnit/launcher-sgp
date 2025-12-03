require("dotenv").config({ path: "./.env" });
const express = require("express");
const logger = require("./src/Logger");
const {runUpdateFlow} = require("./src/UpdateFlow");

const allowedEnvs = ["hml", "prd"];
const API_HOST = process.env.API_HOST || "http://localhost";
const API_PORT = process.env.API_PORT || 3080;

const app = express();


/**
 * Helper to run the update flow safely
 * @param {import('express').Response} response - Express response object
 * @param {boolean} force - Force update flag
 * @param {string[]|string} env - Array of environment names
 * @returns {Promise<void>}
 */
async function handleUpdate(
    response,
    force,
    env,
) {
    try {
        const tipo = force ? "forçada" : "padrão";

        // Se vier string, transforma em array
        if (env && typeof env === "string") {
            env = [env];
        }

        // Validação: precisa ter pelo menos 1 env válido
        if (!env ||
            !Array.isArray(env) ||
            env.length === 0 ||
            !env.every(e => allowedEnvs.includes(e))
        ) {
            return response
                .status(400)
                .json({
                    erro: "Ambiente(s) inválido(s).",
                    mensagem: "O parâmetro 'env' deve conter apenas valores: hml, prd."
                });
        }

        await runUpdateFlow(force, env);

        return response
            .status(202)
            .json({ mensagem: `Processo de atualização '${tipo}' iniciado para o ambiente: ${env}.`});

    } catch (error) {
        logger.error("Erro ao executar a atualização:", error);
        return response
            .status(500)
            .json({ mensagem: "Falha ao iniciar o processo de atualização." });
    }
}



app.get("/update", (req, res) => {
    logger.info("Solicitado atualização padrão do SGP");

    const env = req.query.env;
    handleUpdate(res, false, env);
});



app.get("/force-update", (req, res) => {
    logger.info("Solicitado atualização forçada do SGP");

    const env = req.query.env;
    handleUpdate(res, true, env);
});



app.get("/health", (req, res) => {
    res.status(200).json({health: "UP", status: "SGP Launcher API está online."});
});



app.listen(API_PORT, async () => {
    logger.info(`Servidor do SGP Launcher rodando na porta ${API_PORT}`);
    logger.info(`Para verificar o health, acesse ${API_HOST}:${API_PORT}/health`);
    logger.info(`Para atualizar, acesse ${API_HOST}:${API_PORT}/update`);
    logger.info(`Para forçar a atualização, acesse ${API_HOST}:${API_PORT}/force-update`);

    logger.info("Executando verificação inicial ao iniciar o serviço...");

    try {
        await runUpdateFlow(true, allowedEnvs);
        logger.info("Verificação inicial concluída com sucesso.");

    } catch (error) {
        logger.error("Erro na verificação inicial:", error);
    }
});
