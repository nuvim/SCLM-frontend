const express = require('express');
const router = express.Router();
const { cadastro, login, esqueceuSenha, resetarSenha } = require('../controladores/authControlador');

router.post('/cadastro', cadastro);
router.post('/login', login);
router.post('/esqueceu-senha', esqueceuSenha);
router.post('/resetar-senha', resetarSenha);

module.exports = router;
