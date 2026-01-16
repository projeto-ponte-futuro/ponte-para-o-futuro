const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFile = path.join(logDir, "system.log");

// escreve log em JSON por linha
function write(event, username, description, extra = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,            // ex: "CADASTRO_USUARIO", "FALHA_LOGIN", "USUARIO_DELETADO"
    username: username || null,
    description: description || null,
    ...extra
  };
  fs.appendFile(logFile, JSON.stringify(entry) + "\n", (err) => {
    if (err) console.error("Erro ao gravar log:", err);
  });
}

module.exports = { write };

