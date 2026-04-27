const db = require('../config/db');

exports.listarDisciplinas = (req, res) => {
  const sql = `
    SELECT id, nome, codigo
    FROM disciplinas
    ORDER BY nome
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar disciplinas:', err);
      return res.status(500).json({ erro: 'Erro ao listar disciplinas.' });
    }

    res.json(results);
  });
};      