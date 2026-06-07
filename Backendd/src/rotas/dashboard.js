const express = require('express');
const router = express.Router();
const { obterEstatisticas } = require('../controladores/dashboardControlador');
const { autenticar } = require('../middlewares/autenticar');

router.use(autenticar);
router.get('/', obterEstatisticas);

module.exports = router;
