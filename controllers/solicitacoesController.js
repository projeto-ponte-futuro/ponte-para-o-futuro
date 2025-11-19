const pool = require('../config/database');
const { logPermissaoAdesao } = require("../utils/eventLogger");

logPermissaoAdesao(req.user.nome, projetoId, alunoId);


// Criar nova solicitação
exports.criarSolicitacao = (req, res) => {
  const { aluno_id, projeto_id } = req.body;
  const sql = 'INSERT INTO alunos_projetos (aluno_id, projeto_id) VALUES (?, ?)';
  
  pool.query(sql, [aluno_id, projeto_id], (err) => {
    if (err) {
      console.error('Erro ao registrar solicitação:', err);
      return res.status(500).json({ mensagem: 'Erro ao registrar solicitação' });
    }
    res.json({ mensagem: 'Solicitação registrada com sucesso' });
  });
};

// Listar solicitações pendentes
exports.listarPendentes = (req, res) => {
  const sql =  `
    SELECT ap.id, u.nome AS nome_aluno, p.titulo AS titulo_projeto, ap.status
    FROM alunos_projetos ap
    JOIN usuarios u ON ap.aluno_id = u.id
    JOIN projetos p ON ap.projeto_id = p.id
    WHERE ap.status = 'solicitado' AND u.tipo = 'aluno'
  `;
  
 pool.query(sql, (err, results) => {
  if (err) {
    console.error('Erro ao buscar solicitações pendentes:', err);
    return res.status(500).json({ mensagem: 'Erro ao buscar solicitações pendentes' });
  }
  console.log(results); // Adicione isto temporariamente
  res.json(results);
});
};

// Responder solicitação
exports.responderSolicitacao = (req, res) => {
  const { id } = req.params;
  const { status, mensagem } = req.body;
  const sql = 'UPDATE alunos_projetos SET status = ?, mensagem_resposta = ? WHERE id = ?';

  pool.query(sql, [status, mensagem, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar solicitação:', err);
      return res.status(500).json({ mensagem: 'Erro ao atualizar solicitação' });
    }
    res.json({ mensagem: 'Solicitação respondida com sucesso' });
  });
};

exports.listarProjetosDoAluno = (req, res) => {
  const { alunoId } = req.query;

  const sql = `
    SELECT p.titulo, p.descricao, sp.status, sp.mensagem_resposta
    FROM alunos_projetos sp
    JOIN projetos p ON sp.projeto_id = p.id
    WHERE sp.aluno_id = ?
     AND sp.status IN ('aprovado', 'negado')
  `;

  pool.query(sql, [alunoId], (err, results) => {
    if (err) {
      console.error('Erro ao listar projetos do aluno:', err);
      return res.status(500).json({ erro: 'Erro interno ao buscar projetos do aluno' });
    }
    res.json(results);
  });
};

exports.listarProjetosSolicitadosDoAluno = (req, res) => {
  const alunoId = req.params.id;

  const query = `
    SELECT projeto_id, status
    FROM alunos_projetos
    WHERE aluno_id = ?
  `;

  pool.query(query, [alunoId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar solicitações do aluno:', err);
      return res.status(500).json({ erro: 'Erro ao buscar solicitações do aluno.' });
    }
    res.json(results); // Ex: [{ projeto_id: 1, status: 'pendente' }]
  });
};