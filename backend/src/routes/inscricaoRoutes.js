const express = require('express');
const router = express.Router();

const inscricaoController = require('../controllers/inscricaoController');

router.post('/', inscricaoController.realizarInscricao);
router.get('/aluno/:id_aluno', inscricaoController.listarInscricoesPorAluno);
router.delete('/', inscricaoController.cancelarInscricao);

module.exports = router;