const express = require('express');
const multer = require('multer');
const path = require('path');
require ('dotenv').config();
const mysql = require('mysql2');

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
}).promise();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const userId = req.body.userId || 'anonimo';
    cb(null, `usuario-${userId}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('foto'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
  }

  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
  }

  try {
    const sql = 'UPDATE usuarios SET fotoPerfil = ? WHERE id = ?';
    await pool.query(sql, [req.file.filename, userId]);

    res.json({
      message: 'Foto enviada e salva com sucesso!',
      caminho: req.file.filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar a foto no banco.' });
  }
});

module.exports = router;
