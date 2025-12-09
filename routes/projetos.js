const express = require('express');
const router = express.Router();
const projetosController = require('../controllers/projetosController');
const db = require('../config/database');
const auth = require ('../utils/auth')


// Listar projetos
router.get('/', projetosController.listarProjetos);

// Rota para cadastrar um novo projeto
router.post('/', projetosController.cadastrarProjeto);
router.post("/cadastrarProjeto", auth, projetosController.cadastrarProjeto);

// Rota para deletar projeto
router.delete('/projetos/:id', projetosController.deletarProjeto);

//Rota para editar um projeto
router.put('/projetos/:id', projetosController.editarProjeto);


// Buscar etapas de um projeto
router.get('/:id/etapas', (req, res) => {
  const sql = `
    SELECT titulo, status, DATE_FORMAT(data_entrega, '%d/%m/%Y') as data
    FROM etapas_projetos
    WHERE projeto_id = ?
    ORDER BY data_entrega DESC
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Cadastrar nova etapa
router.post('/:id/etapas', (req, res) => {
  const { titulo, status } = req.body;
  const sql = `
    INSERT INTO etapas_projetos (titulo, status, projeto_id, data_entrega)
    VALUES (?, ?, ?, CURDATE())
  `;
  db.query(sql, [titulo, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({
      id: result.insertId,
      titulo,
      status,
      data: new Date().toLocaleDateString('pt-BR')
    });
  });
});


module.exports = router;
