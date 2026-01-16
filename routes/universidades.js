const express = require('express');
const router = express.Router();
const universidadeController = require('../controllers/universidadeController');

router.post('/cadastro', universidadeController.cadastrar);
router.post('/login', universidadeController.login);
router.get('/', universidadeController.listar);
router.put('/:id', universidadeController.atualizar);
router.delete('/:id', universidadeController.deletar);

module.exports = router;
