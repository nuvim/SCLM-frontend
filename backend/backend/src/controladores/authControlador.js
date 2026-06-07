const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/banco');

// POST /api/auth/cadastro
async function cadastro(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const [existente] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?', [email]
    );
    if (existente.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
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

// POST /api/auth/login
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRA_EM,
    });

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

// POST /api/auth/esqueceu-senha
async function esqueceuSenha(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ mensagem: 'E-mail é obrigatório.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?', [email]
    );

    // Sempre retornar 200 para não revelar quais e-mails existem
    if (rows.length === 0) {
      return res.json({ mensagem: 'Se o e-mail existir, você receberá as instruções.' });
    }

    const usuarioId = rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await pool.query(
      'INSERT INTO tokens_reset_senha (usuario_id, token, expira_em) VALUES (?, ?, ?)',
      [usuarioId, token, expiraEm]
    );

    // >>> BACKEND: trocar por envio real de e-mail (ex: nodemailer) <<<
    console.log(`🔑 Token de reset para ${email}: ${token}`);

    return res.json({ mensagem: 'Se o e-mail existir, você receberá as instruções.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

// POST /api/auth/resetar-senha
async function resetarSenha(req, res) {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha) {
    return res.status(400).json({ mensagem: 'Token e nova senha são obrigatórios.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM tokens_reset_senha 
       WHERE token = ? AND usado = FALSE AND expira_em > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ mensagem: 'Token inválido ou expirado.' });
    }

    const { id, usuario_id } = rows[0];
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await pool.query('UPDATE usuarios SET senha_hash = ? WHERE id = ?', [senhaHash, usuario_id]);
    await pool.query('UPDATE tokens_reset_senha SET usado = TRUE WHERE id = ?', [id]);

    return res.json({ mensagem: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

module.exports = { cadastro, login, esqueceuSenha, resetarSenha };
