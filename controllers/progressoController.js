const db = require('../config/database');

const { logAlteracaoProgresso } = require("../utils/eventLogger");

logAlteracaoProgresso(req.user.nome, projetoId, novoProgresso);


exports.getProgressoProjeto = (req, res) => {
  const projetoId = req.params.id;

  // Busca o nome do projeto
  const queryProjeto = 'SELECT titulo FROM projetos WHERE id = ?';
  // Busca as etapas
  const queryEtapas = 'SELECT titulo, status, data_entrega FROM etapas_projetos WHERE projeto_id = ?';

  db.query(queryProjeto, [projetoId], (err, resultadoProjeto) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar projeto' });
    }

    if (resultadoProjeto.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const nomeProjeto = resultadoProjeto[0].titulo;

    db.query(queryEtapas, [projetoId], (err, resultadoEtapas) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar etapas' });
      }

      const etapas = resultadoEtapas.map(etapa => ({
        titulo: etapa.titulo,
        status: etapa.status
      }));

      const historico = resultadoEtapas
        .filter(etapa => etapa.status === 'Entregue' && etapa.data_entrega)
        .map(etapa => `${etapa.titulo} entregue em ${new Date(etapa.data_entrega).toLocaleDateString('pt-BR')}`);

      res.json({
        nomeProjeto,
        etapas,
        historico
      });
    });
  });
};

// Criar nova etapa

exports.criarEtapa = (req, res) => {
  const { projeto_id, titulo, status } = req.body;

  if (!projeto_id || !titulo || !status) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const query = `
    INSERT INTO etapas_projetos (projeto_id, titulo, status)
    VALUES (?, ?, ?)
  `;

  db.query(query, [projeto_id, titulo, status], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar etapa' });
    res.status(201).json({ message: 'Etapa criada com sucesso', id: resultado.insertId });
  });
};

//Atualizar status da etapa

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
    res.json({ message: 'Status atualizado com sucesso' });
  });
};

