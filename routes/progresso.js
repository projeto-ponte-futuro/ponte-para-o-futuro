const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Listar projetos do aluno
router.get('/:id/projetos', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.id, p.titulo
    FROM projetos p
    INNER JOIN alunos_projetos ap ON p.id = ap.projeto_id
    WHERE ap.aluno_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
