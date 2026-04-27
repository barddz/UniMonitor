const db = require('../config/db');

exports.cadastrarUsuario = (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;

  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({
      erro: 'Preencha todos os campos.'
    });
  }

  if (tipo_usuario !== 'aluno' && tipo_usuario !== 'monitor') {
    return res.status(400).json({
      erro: 'Tipo de usuário inválido.'
    });
  }

  const sql = `
    INSERT INTO usuarios (nome, email, senha, tipo_usuario)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, email, senha, tipo_usuario], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar usuário:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          erro: 'Este email já está cadastrado.'
        });
      }

      return res.status(500).json({
        erro: 'Erro ao cadastrar usuário.'
      });
    }

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      id: result.insertId
    });
  });
};