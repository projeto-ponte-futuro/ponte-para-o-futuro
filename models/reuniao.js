const pool = require('../config/database');

const Reuniao = {
  criar: (reuniao, callback) => {
    const { id_mentor, id_projeto, id_aluno, data_hora, link_reuniao } = reuniao;
    const query = `
      INSERT INTO reunioes (id_mentor, id_projeto, id_aluno, data_hora, link_reuniao)
      VALUES (?, ?, ?, ?, ?)
    `;
    pool.query(query, [id_mentor, id_projeto, id_aluno, data_hora, link_reuniao], callback);
  },
  // (opcional) listar, excluir, etc
};

module.exports = Reuniao;