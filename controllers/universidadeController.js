const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Universidade = require('../models/universidadeModel');

const SECRET = process.env.JWT_SECRET || 'ponte-secreta';

const universidadeController = {
  cadastrar: async (req, res) => {
    const { nome, email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);
    Universidade.criar(nome, email, hash, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar universidade' });
      res.status(201).json({ mensagem: 'Universidade cadastrada com sucesso!' });
    });
  },

  login: (req, res) => {
    const { email, senha } = req.body;

    Universidade.buscarPorEmail(email, async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const universidade = results[0];
      const senhaValida = await bcrypt.compare(senha, universidade.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }

      const token = jwt.sign({ id: universidade.id, tipo: 'universidade' }, SECRET, { expiresIn: '1d' });
      res.json({ mensagem: 'Login realizado com sucesso', token });
    });
  },

  listar: (req, res) => {
    Universidade.listar((err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao listar universidades' });
      res.json(results);
    });
  },
  
  atualizar: async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
  
    const hash = await bcrypt.hash(senha, 10);
  
    Universidade.atualizar(id, nome, email, hash, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar cadastro' });
      res.json({ mensagem: 'Cadastro atualizado com sucesso' });
    });
  },
  
  deletar: (req, res) => {
    const { id } = req.params;
  
    Universidade.deletar(id, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao deletar universidade' });
      res.json({ mensagem: 'Universidade deletada com sucesso' });
    });
  }
  
};



module.exports = universidadeController;

