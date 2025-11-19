const pool = require('../config/database');

const { logCadastroProjeto } = require("../utils/eventLogger");

const projeto = await Projeto.create({ });
logCadastroProjeto(req.user.nome, projeto.id);


// Controlador para listar os projetos cadastrados
exports.listarProjetos = (req, res) => {
  const sql = 'SELECT id, titulo, descricao, status, data_inicio, data_termino, id_universidade FROM projetos';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar projetos:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar projetos' });
    }
    res.json(results);
  });
};

// Controlador para cadastrar um novo projeto
exports.cadastrarProjeto = (req, res) => {
  const { titulo, descricao, status, data_inicio, data_termino, id_universidade } = req.body;

  // Validação simples
  if (!titulo || !status || !data_inicio || !data_termino || !id_universidade) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios!' });
  }

  const sql = 'INSERT INTO projetos (titulo, descricao, status, data_inicio, data_termino, id_universidade) VALUES (?, ?, ?, ?, ?, ?)';

  pool.query(sql, [titulo, descricao, status, data_inicio, data_termino, id_universidade], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar projeto:', err);
      return res.status(500).json({ mensagem: 'Erro ao cadastrar projeto' });
    }
    res.status(201).json({ mensagem: 'Projeto cadastrado com sucesso!', id: result.insertId });
  });
};

// Controlador para deletar um projeto
exports.deletarProjeto = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM projetos WHERE id = ?';

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar projeto:', err);
      return res.status(500).json({ mensagem: 'Erro ao deletar projeto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Projeto não encontrado' });
    }

    res.json({ mensagem: 'Projeto deletado com sucesso' });
  });
};

