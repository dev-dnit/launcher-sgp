const Service = require("node-windows").Service;
const path = require("path");

const svc = new Service({
  name: "SGP Launcher Service",
  description: "Serviço de atualização automática para o SGP.",
  script: path.join(__dirname, "sgp-launcher.exe"),
});

svc.on("install", function () {
  console.log("Serviço instalado com sucesso.");
  console.log("Iniciando o serviço...");
  svc.start();
});

console.log('Instalando o serviço "SGP Launcher Service"...');
svc.install();
