const pool = require('../config/database');
const { validatePassword } = require('../utils/passwordPolicy');
const authStorage = require("../utils/authStorage");
const logService = require("../services/logService");
const bcrypt = require('bcryptjs');

/* =========================================================
   CADASTRAR USUÁRIO
   ========================================================= */
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios!' });
    }

    const check = validatePassword(senha);
    if (!check.ok) return res.status(400).json({ error: check.message });

    const passwordHash = await bcrypt.hash(senha, 12);

    const sql = 'INSERT INTO usuarios (nome, email, tipo) VALUES (?, ?, ?)';
    pool.query(sql, [nome, email, tipo], async (err, result) => {
      if (err) return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });

      const userId = result.insertId;

      await authStorage.saveUserAuth(userId, {
        passwordHash,
        previousHashes: [],
        failedAttempts: 0,
        lockUntil: null
      });

      logService.write("CADASTRO_USUARIO", {
        usuario: nome,
        descricao: "Cadastro de novo usuário."
      });

      return res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        id: userId
      });
    });

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

/* =========================================================
   LISTAR USUÁRIOS
   ========================================================= */
exports.listarUsuarios = (req, res) => {
  const sql = 'SELECT id, nome, email, tipo, status FROM usuarios';

  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
    res.json(results);
  });
};

/* =========================================================
   BUSCAR POR ID
   ========================================================= */
exports.buscarUsuarioPorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, nome, email, tipo, status FROM usuarios WHERE id = ?';

  pool.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao buscar usuário' });

    if (results.length === 0)
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    res.json(results[0]);
  });
};

/* =========================================================
   ATUALIZAR USUÁRIO + ALTERAÇÃO DE SENHA
   ========================================================= */
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo } = req.body;

  try {
    // Buscar usuário atual
    const sqlBusca = "SELECT nome FROM usuarios WHERE id = ?";
    const [usuario] = await pool.promise().query(sqlBusca, [id]);

    if (usuario.length === 0)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    let passwordHash = null;

    if (senha) {
      const check = validatePassword(senha);
      if (!check.ok) return res.status(400).json({ error: check.message });

      passwordHash = await bcrypt.hash(senha, 12);

      // Atualiza o arquivo de autenticação
      const authData = authStorage.loadUserAuth(id);

      authData.previousHashes.push(authData.passwordHash);
      authData.passwordHash = passwordHash;

      authStorage.saveUserAuth(id, authData);

      logService.write("ALTERACAO_SENHA", {
        usuario: usuario[0].nome,
        descricao: "Usuário alterou a senha."
      });
    }

    const sql =
      "UPDATE usuarios SET nome = ?, email = ?, tipo = ? WHERE id = ?";
    await pool.promise().query(sql, [nome, email, tipo, id]);

    logService.write("ALTERACAO_USUARIO", {
      usuario: nome,
      descricao: "Dados do usuário foram alterados."
    });

    res.json({ mensagem: "Usuário atualizado com sucesso!" });

  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
  }
};

/* =========================================================
   DELETAR USUÁRIO
   ========================================================= */
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [usuario] = await pool.promise().query(
      "SELECT nome FROM usuarios WHERE id = ?",
      [id]
    );

    if (usuario.length === 0)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    await pool.promise().query("DELETE FROM usuarios WHERE id = ?", [id]);

      // log
      logService.write("EXCLUSAO_USUARIO", {
        usuario: nome,
        descricao: "Usuário excluído do sistema."
      });


    res.json({ mensagem: "Usuário deletado com sucesso!" });

  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao deletar usuário" });
  }
};

/* =========================================================
   LOGIN USUÁRIO + LOGS
   ========================================================= */
exports.loginUsuario = async (req, res) => {
  // Aceita tanto nomes antigos quanto novos
  const email =
    req.body.email ||
    req.body.username ||
    req.body["login-username"] ||
    req.body.user ||
    null;

  const senha =
    req.body.senha ||
    req.body.password ||
    req.body["login-password"] ||
    null;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

  try {
    const sql = "SELECT id, nome, email, tipo FROM usuarios WHERE email = ?";
    pool.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Erro no SQL LOGIN:", err);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
      }

      if (results.length === 0) {
        logService.write("ERRO_AUTENTICACAO", {
          usuario: email,
          descricao: "Usuário não encontrado."
        });
        return res.status(401).json({ mensagem: "Usuário não encontrado." });
      }

      const usuario = results[0];
      const authData = authStorage.loadUserAuth(usuario.id);

      if (!authData) {
        return res.status(500).json({
          mensagem: "Erro interno: dados de autenticação não encontrados."
        });
      }

      if (authData.lockUntil && Date.now() < authData.lockUntil) {
        return res.status(403).json({
          mensagem: "Conta bloqueada temporariamente."
        });
      }

      const senhaCorreta = await bcrypt.compare(senha, authData.passwordHash);

      if (!senhaCorreta) {
        const attempts = authStorage.registerFailedAttempt(usuario.id);

        logService.write("ERRO_AUTENTICACAO", {
          usuario: usuario.nome,
          descricao: "Senha incorreta."
        });

        if (attempts === 5) {
          logService.write("FALHAS_CONSECUTIVAS", {
            usuario: usuario.nome,
            descricao: "5 falhas consecutivas de login no mesmo dia."
          });
        }

        return res.status(401).json({ mensagem: "Senha incorreta!" });
      }

      // Resetar as tentativas
      authStorage.resetAttempts(usuario.id);

      logService.write("LOGIN_SUCESSO", {
        usuario: usuario.nome,
        descricao: "Login realizado com sucesso."
      });

      return res.status(200).json({
        sucesso: true,
        mensagem: "Login realizado com sucesso!",
        usuario
      });
    });

  } catch (error) {
    console.error("Erro LOGIN:", error);
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};