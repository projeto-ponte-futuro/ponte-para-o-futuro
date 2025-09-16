const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Cadastro de novo usuário
router.post('/', userController.cadastrarUsuario);

// Listar usuários
router.get('/', userController.listarUsuarios);

//Buscar usuário pela identificação
router.get('/:id', userController.buscarUsuarioPorId);

//Atualizar e deletar usuários
router.put('/:id', userController.atualizarUsuario);
router.delete('/:id', userController.deletarUsuario);

//Login
router.post('/login', userController.loginUsuario);

module.exports = router;