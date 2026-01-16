const db = require('../config/database');
const { logAlteracaoProgresso } = require("../utils/eventLogger");

exports.atualizarStatusEtapa = (req, res) => {
  const etapaId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status é obrigatório' });
  }

  let query;
  let params;

  if (status === 'Entregue') {
    query = `
      UPDATE etapas_projetos
      SET status = ?, data_entrega = CURRENT_DATE
      WHERE id = ?
    `;
    params = [status, etapaId];
  } else {
    query = `
      UPDATE etapas_projetos
      SET status = ?, data_entrega = NULL
      WHERE id = ?
    `;
    params = [status, etapaId];
  }

  db.query(query, params, (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar etapa' });

    // >>> REGISTRA EVENTO
    logAlteracaoProgresso(
      req.user.nome,
      req.body.projeto_id,
      status
    );

    res.json({ message: 'Status atualizado com sucesso' });
  });
};
