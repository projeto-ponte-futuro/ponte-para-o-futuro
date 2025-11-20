const pool = require('../config/database');

const { logCadastroProjeto } = require("../utils/eventLogger");

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
exports.cadastrarProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.create({ ...req.body });
    logCadastroProjeto(req.user.nome, projeto.id);

    res.status(201).json({
      mensagem: "Projeto cadastrado com sucesso!",
      id: projeto.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao cadastrar projeto" });
  }
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

