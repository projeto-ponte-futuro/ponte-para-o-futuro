const express = require('express');
const router = express.Router();
const solicitacoesController = require('../controllers/solicitacoesController');

// Criar nova solicitação
router.post('/', solicitacoesController.criarSolicitacao);

// Listar solicitações pendentes
router.get('/pendentes', solicitacoesController.listarPendentes);

// Responder uma solicitação
router.put('/:id', solicitacoesController.responderSolicitacao);

// Rota para buscar os projetos associados a um aluno
router.get('/projetos-do-aluno', solicitacoesController.listarProjetosDoAluno);

// Rota para buscar solicitações pendentes do aluno
router.get('/projetos-solicitados/:id', solicitacoesController.listarProjetosSolicitadosDoAluno);

module.exports = router;