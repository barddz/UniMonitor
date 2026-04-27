const db = require('../config/db');

exports.realizarInscricao = (req, res) => {
  const { id_aluno, id_monitoria } = req.body;

  if (!id_aluno || !id_monitoria) {
    return res.status(400).json({ erro: 'Aluno e monitoria são obrigatórios.' });
  }

  const verificarAluno = `
    SELECT tipo_usuario
    FROM usuarios
    WHERE id = ?
  `;

  db.query(verificarAluno, [id_aluno], (err, usuarios) => {
    if (err) {
      console.error('Erro ao verificar aluno:', err);
      return res.status(500).json({ erro: 'Erro ao verificar aluno.' });
    }

    if (usuarios.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    if (usuarios[0].tipo_usuario !== 'aluno') {
      return res.status(403).json({ erro: 'Apenas alunos podem se inscrever em monitorias.' });
    }

    const verificarMonitoria = `
      SELECT id
      FROM monitorias
      WHERE id = ?
    `;

    db.query(verificarMonitoria, [id_monitoria], (err, monitorias) => {
      if (err) {
        console.error('Erro ao verificar monitoria:', err);
        return res.status(500).json({ erro: 'Erro ao verificar monitoria.' });
      }

      if (monitorias.length === 0) {
        return res.status(404).json({ erro: 'Monitoria não encontrada.' });
      }

      const sql = `
        INSERT INTO inscricoes (id_aluno, id_monitoria)
        VALUES (?, ?)
      `;

      db.query(sql, [id_aluno, id_monitoria], (err) => {
        if (err) {
          console.error('Erro ao realizar inscrição:', err);

          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Você já está inscrito nesta monitoria.' });
          }

          return res.status(500).json({ erro: 'Erro ao realizar inscrição.' });
        }

        res.status(201).json({ mensagem: 'Inscrição realizada com sucesso.' });
      });
    });
  });
};

exports.listarInscricoesPorAluno = (req, res) => {
  const { id_aluno } = req.params;

  const sql = `
    SELECT id_monitoria
    FROM inscricoes
    WHERE id_aluno = ?
  `;

  db.query(sql, [id_aluno], (err, results) => {
    if (err) {
      console.error('Erro ao listar inscrições:', err);
      return res.status(500).json({ erro: 'Erro ao listar inscrições.' });
    }

    res.json(results);
  });
};

exports.cancelarInscricao = (req, res) => {
  const { id_aluno, id_monitoria } = req.body;

  if (!id_aluno || !id_monitoria) {
    return res.status(400).json({ erro: 'Aluno e monitoria são obrigatórios.' });
  }

  const sql = `
    DELETE FROM inscricoes
    WHERE id_aluno = ? AND id_monitoria = ?
  `;

  db.query(sql, [id_aluno, id_monitoria], (err, result) => {
    if (err) {
      console.error('Erro ao cancelar inscrição:', err);
      return res.status(500).json({ erro: 'Erro ao cancelar inscrição.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Inscrição não encontrada.' });
    }

    res.json({ mensagem: 'Inscrição cancelada com sucesso.' });
  });
};