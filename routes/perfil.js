const express = require('express');
const router = express.Router();
const perfilControllers = require('../controllers/perfilControllers');

router.get('/perfil/:usuarioId', perfilControllers.buscarPerfil);
router.post('/perfil', (req, res, next) => {
  console.log('POST /api/perfil recebido:', req.body);
  perfilControllers.salvarPerfil(req, res);
});

module.exports = router;