const express = require('express');
const router = express.Router();
const { cadastro, login, esqueceuSenha } = require('../controladores/authControlador');

router.post('/cadastro', cadastro);
router.post('/login', login);
router.post('/esqueceu-senha', esqueceuSenha);

module.exports = router;
