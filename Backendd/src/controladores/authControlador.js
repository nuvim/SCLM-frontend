const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/banco');

const SENHAS_COMUNS = [
  '12345678', '123456789', 'senha', 'senha1234', 'asdfghjklç',
  'abc12345', 'password', 'admin123', 'usuario', '00000000',
];

function validarSenha(senha) {
  const erros = [];

  if (!senha || typeof senha !== 'string') {
    return ['Senha é obrigatória.'];
  }

  if (senha.length < 8) {
    erros.push('A senha deve ter no mínimo 8 caracteres.');
  }
  if (senha.length > 72) {
    erros.push('A senha deve ter no máximo 72 caracteres.');
  }

  if (!/[A-Z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra maiúscula.');
  }
  if (!/[a-z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra minúscula.');
  }
  if (!/[0-9]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um número.');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um caractere especial (!@#$%^&* etc).');
  }

  if (/[\x00-\x1F\x7F]/.test(senha)) {
    erros.push('A senha contém caracteres inválidos.');
  }

  if (/^(.)\1+$/.test(senha)) {
    erros.push('A senha não pode ser composta por caracteres repetidos.');
  }

  if (SENHAS_COMUNS.includes(senha.toLowerCase())) {
    erros.push('Essa senha é muito comum. Escolha uma mais segura.');
  }

  return erros;
}

async function cadastro(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ mensagem: 'E-mail inválido.' });
  }

  if (email.length > 255) {
    return res.status(400).json({ mensagem: 'E-mail muito longo.' });
  }

  if (nome.length > 150) {
    return res.status(400).json({ mensagem: 'Nome muito longo.' });
  }

  const errosSenha = validarSenha(senha);
  if (errosSenha.length > 0) {
    return res.status(400).json({ mensagem: errosSenha[0], erros: errosSenha });
  }

  try {
    const [existente] = await pool.query(
      'SELECT id_user FROM usuario WHERE email = ?', [email]
    );
    if (existente.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [resultado] = await pool.query(
      'INSERT INTO usuario (nome_usuario, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    const token = jwt.sign({ id: resultado.insertId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRA_EM,
    });

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso.',
      token,
      usuario: { id: resultado.insertId, nome, email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  if (senha.length > 72) {
    return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuario WHERE email = ?', [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: usuario.id_user }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRA_EM,
    });

    return res.json({
      token,
      usuario: { id: usuario.id_user, nome: usuario.nome_usuario, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

async function esqueceuSenha(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ mensagem: 'E-mail é obrigatório.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id_user FROM usuario WHERE email = ?', [email]
    );

    if (rows.length === 0) {
      return res.json({ mensagem: 'Se o e-mail existir, você receberá as instruções.' });
    }

    console.log(` Solicitação de reset para: ${email}`);

    return res.json({ mensagem: 'Se o e-mail existir, você receberá as instruções.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

module.exports = { cadastro, login, esqueceuSenha };
