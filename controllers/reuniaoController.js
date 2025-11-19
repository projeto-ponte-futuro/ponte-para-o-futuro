const pool = require('../config/database');
const Reuniao = require('../models/reuniao');

const { logCriacaoReuniao } = require("../utils/eventLogger");

logCriacaoReuniao(req.user.nome, reuniao.id);


exports.criarReuniao = (req, res) => {
  const { id_mentor, id_projeto, id_aluno, data, hora, link_reuniao } = req.body;

  const data_hora = `${data} ${hora}`;

  const novaReuniao = {
    id_mentor,
    id_projeto,
    id_aluno,
    data_hora,
    link_reuniao
  };

  Reuniao.criar(novaReuniao, (err, resultado) => {
    if (err) {
      console.error('Erro ao criar reunião:', err);
      return res.status(500).json({ erro: 'Erro ao agendar reunião.' });
    }

    res.status(201).json({ mensagem: 'Reunião agendada com sucesso!' });
  });
};

// Listar alunos vinculados a um projeto
exports.listarAlunosDoProjeto = (req, res) => {
  const { id_projeto } = req.params;
  console.log('Buscando alunos do projeto ID:', id_projeto);

  const sql = `
  SELECT u.id, u.nome, u.email
  FROM alunos_projetos pa
  JOIN usuarios u ON pa.aluno_id = u.id
  WHERE pa.projeto_id = ? AND pa.status = 'aprovado'`;

  pool.query(sql, [id_projeto], (err, results) => {
    if (err) {
      console.error('Erro ao buscar alunos do projeto:', err?.sqlMessage || err?.message || err);
      return res.status(500).json({ error: 'Erro ao buscar alunos do projeto' });
    } if (result.length === 0) {
  res.status(200).json([]);
}
res.json(results);
  });
};
