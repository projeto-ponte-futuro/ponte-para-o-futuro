const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Cadastrar usuários
exports.cadastrarUsuario = (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios!' });
  }

  // Criptografar a senha antes de salvar
  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) {
      console.error('Erro ao criptografar senha:', err);
      return res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário' });
    }

    const sql = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    pool.query(sql, [nome, email, hash, tipo], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar usuário:', err);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
      }
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: result.insertId });
    });
  });
};

// Listar usuários
exports.listarUsuarios = (req, res) => {
  const sql = 'SELECT id, nome, email, tipo, status FROM usuarios';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
};

// Buscar usuário por ID
exports.buscarUsuarioPorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, nome, email, tipo, status FROM usuarios WHERE id = ?';

  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    res.json(results[0]);
  });
};

// Atualizar usuário (recriptografar se senha for alterada)
exports.atualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo } = req.body;

  // Criptografar nova senha
  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) {
      console.error('Erro ao criptografar senha:', err);
      return res.status(500).json({ mensagem: 'Erro interno ao atualizar usuário' });
    }

    const sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ?, tipo = ? WHERE id = ?';
    pool.query(sql, [nome, email, hash, tipo, id], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
      }
      res.json({ mensagem: 'Usuário atualizado com sucesso!' });
    });
  });
};

// Deletar usuário
exports.deletarUsuario = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM usuarios WHERE id = ?';

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
    res.json({ mensagem: 'Usuário deletado com sucesso!' });
  });
};

// Login de usuário
exports.loginUsuario = (req, res) => {
  const { 'login-username': email, 'login-password': senha } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  pool.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuario = results[0];

    // Comparar a senha informada com a senha criptografada do banco
    bcrypt.compare(senha, usuario.senha, (err, resultado) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err);
        return res.status(500).json({ mensagem: 'Erro ao validar senha' });
      }

      if (!resultado) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
      }

      // Login bem-sucedido
      res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario });
    });
  });
};