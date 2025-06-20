require('dotenv').config();
require('./config/database'); //Importando o banco de dados para conexão

const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(cors()); // Adiciona o middleware CORS para permitir requisições de outros domínios
app.use(express.json()); // Utilizei esse comando para que o Express entenda o corpo da requisição em JSON. Antes disso o servidor estava entendendo como "undefined".
app.use(express.urlencoded({ extended: true }));

// Importando as rotas
const usersRoutes = require('./routes/users');
const projetosRoutes = require('./routes/projetos')
const universidadeRoutes = require('./routes/universidades');
const solicitacoesRoutes = require('./routes/solicitacoes');
const reunioesRoutes = require('./routes/reunioes');
const perfilRoutes = require('./routes/perfil');
const progressoRoutes = require('./routes/progresso');


//Rotas
app.use('/api/reunioes', reunioesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projetos', projetosRoutes);
app.use('/universidades', universidadeRoutes);
app.use('/api', perfilRoutes);
app.use('/api/solicitacoes', solicitacoesRoutes);
app.use('/alunos', progressoRoutes); 

// Serve arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve arquivos HTML diretamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/saibamais', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'saibamais.html'));
});

app.get('/parceiros', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'parceiros.html'));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});