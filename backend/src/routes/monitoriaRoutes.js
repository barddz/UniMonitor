const express = require('express');
const router = express.Router();

const monitoriaController = require('../controllers/monitoriaController');

router.get('/', monitoriaController.listarMonitorias);
router.post('/', monitoriaController.criarMonitoria);

module.exports = router;