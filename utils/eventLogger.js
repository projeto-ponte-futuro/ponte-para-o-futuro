const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logPath)) fs.mkdirSync(logPath, { recursive: true });

const logFile = path.join(logPath, "eventos.log");

function registrarEvento(usuario, evento, descricao) {
  const linha = `[${new Date().toISOString()}] - USER: ${usuario} - EVENTO: ${evento} - DESC: ${descricao}\n`;
  fs.appendFileSync(logFile, linha, "utf8");
}

/* Eventos específicos */

module.exports = {
  registrarEvento,

  logCadastroUsuario(usuario) {
    registrarEvento(usuario, "CADASTRO_USUARIO", "Usuário cadastrado com sucesso");
  },

  logAlteracaoUsuario(usuario) {
    registrarEvento(usuario, "ALTERACAO_USUARIO", "Dados ou senha alterados");
  },

  logExclusaoUsuario(usuario) {
    registrarEvento(usuario, "EXCLUSAO_USUARIO", "Usuário removido do sistema");
  },

  logErroAutenticacao(usuario) {
    registrarEvento(usuario, "ERRO_AUTENTICACAO", "Falha de autenticação");
  },

  log5Falhas(usuario) {
    registrarEvento(usuario, "FALHAS_AUTENTICACAO", "5 falhas consecutivas no mesmo dia");
  },

  // ---- NOVOS EVENTOS ----
  logCadastroProjeto(usuario, projetoId) {
    registrarEvento(usuario, "CADASTRO_PROJETO", `Projeto criado. ID: ${projetoId}`);
  },

  logUploadImagem(usuario, imagemNome) {
    registrarEvento(usuario, "UPLOAD_IMAGEM", `Imagem enviada: ${imagemNome}`);
  },

  logCriacaoReuniao(usuario, reuniaoId) {
    registrarEvento(usuario, "CRIACAO_REUNIAO", `Reunião criada. ID: ${reuniaoId}`);
  },

  logPermissaoAdesao(usuario, projetoId, alunoId) {
    registrarEvento(
      usuario,
      "ADESAO_PERMITIDA",
      `A adesão do aluno ${alunoId} ao projeto ${projetoId} foi aprovada`
    );
  },

  logAlteracaoProgresso(usuario, projetoId, progresso) {
    registrarEvento(
      usuario,
      "ALTERACAO_PROGRSSO",
      `Progresso do projeto ${projetoId} atualizado para ${progresso}%`
    );
  }
};
