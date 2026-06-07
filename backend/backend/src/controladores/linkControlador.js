const { pool } = require('../config/banco');

// GET /api/links
async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM links WHERE usuario_id = ? ORDER BY criado_em DESC',
      [req.usuarioId]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar links.' });
  }
}

// POST /api/links
async function criar(req, res) {
  const { titulo, url, descricao, categoria } = req.body;

  if (!titulo || !url) {
    return res.status(400).json({ mensagem: 'Título e URL são obrigatórios.' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO links (usuario_id, titulo, url, descricao, categoria) VALUES (?, ?, ?, ?, ?)',
      [req.usuarioId, titulo, url, descricao || null, categoria || null]
    );

    const [rows] = await pool.query('SELECT * FROM links WHERE id = ?', [resultado.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao criar link.' });
  }
}

// PUT /api/links/:id
async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, url, descricao, categoria } = req.body;

  try {
    const [existente] = await pool.query(
      'SELECT id FROM links WHERE id = ? AND usuario_id = ?',
      [id, req.usuarioId]
    );
    if (existente.length === 0) {
      return res.status(404).json({ mensagem: 'Link não encontrado.' });
    }

    await pool.query(
      'UPDATE links SET titulo = ?, url = ?, descricao = ?, categoria = ? WHERE id = ?',
      [titulo, url, descricao || null, categoria || null, id]
    );

    const [rows] = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar link.' });
  }
}

// DELETE /api/links/:id
async function deletar(req, res) {
  const { id } = req.params;

  try {
    const [existente] = await pool.query(
      'SELECT id FROM links WHERE id = ? AND usuario_id = ?',
      [id, req.usuarioId]
    );
    if (existente.length === 0) {
      return res.status(404).json({ mensagem: 'Link não encontrado.' });
    }

    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    return res.json({ mensagem: 'Link deletado com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao deletar link.' });
  }
}

module.exports = { listar, criar, atualizar, deletar };
