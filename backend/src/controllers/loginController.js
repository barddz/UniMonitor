const db = require('../config/db');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erro: 'Email e senha são obrigatórios.'
    });
  }

  const sql = `
    SELECT id, nome, email, tipo_usuario
    FROM usuarios
    WHERE email = ? AND senha = ?
  `;

  db.query(sql, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao fazer login:', err);
      return res.status(500).json({
        erro: 'Erro ao fazer login.'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos.'
      });
    }

    res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario: results[0]
    });
  });
};      