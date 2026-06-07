const express = require('express');
const router = express.Router();
const { listar, criar, atualizar, deletar } = require('../controladores/musicaControlador');
const { autenticar } = require('../middlewares/autenticar');

router.use(autenticar);
router.get('/', listar);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;
