const db = require('../config/db');

exports.listarMonitorias = (req, res) => {
  const sql = `
    SELECT
      m.id,
      u.nome AS monitor,
      d.nome AS disciplina,
      d.codigo,
      m.data,
      m.hora_inicio,
      m.hora_fim,
      m.modalidade,
      m.local_ou_link
    FROM monitorias m
    JOIN usuarios u ON m.id_monitor = u.id
    JOIN disciplinas d ON m.id_disciplina = d.id
    ORDER BY m.data, m.hora_inicio
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar monitorias:', err);
      return res.status(500).json({ erro: 'Erro ao listar monitorias.' });
    }

    res.json(results);
  });
};

exports.criarMonitoria = (req, res) => {
  const {
    id_monitor,
    id_disciplina,
    data,
    hora_inicio,
    hora_fim,
    modalidade,
    local_ou_link
  } = req.body;

  if (!id_monitor || !id_disciplina || !data || !hora_inicio || !hora_fim || !modalidade || !local_ou_link) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  const verificarUsuario = `
    SELECT tipo_usuario
    FROM usuarios
    WHERE id = ?
  `;

  db.query(verificarUsuario, [id_monitor], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).json({ erro: 'Erro ao verificar usuário.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (results[0].tipo_usuario !== 'monitor') {
      return res.status(403).json({ erro: 'Apenas monitores podem criar monitorias.' });
    }

    const sql = `
      INSERT INTO monitorias
      (id_monitor, id_disciplina, data, hora_inicio, hora_fim, modalidade, local_ou_link)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [id_monitor, id_disciplina, data, hora_inicio, hora_fim, modalidade, local_ou_link],
      (err, result) => {
        if (err) {
          console.error('Erro ao criar monitoria:', err);
          return res.status(500).json({ erro: 'Erro ao criar monitoria.' });
        }

        res.status(201).json({
          mensagem: 'Monitoria criada com sucesso.',
          id: result.insertId
        });
      }
    );
  });
};  