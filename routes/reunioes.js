const express = require('express');
const router = express.Router();
const reuniaoController = require('../controllers/reuniaoController');

router.post('/agendar', reuniaoController.criarReuniao);
router.get('/alunos/:id', reuniaoController.listarAlunosDoProjeto);

module.exports = router;