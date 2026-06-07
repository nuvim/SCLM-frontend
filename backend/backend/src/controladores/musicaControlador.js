const { pool } = require('../config/banco');

// GET /api/musicas
async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM musicas WHERE usuario_id = ? ORDER BY criado_em DESC',
      [req.usuarioId]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar músicas.' });
  }
}

// POST /api/musicas
async function criar(req, res) {
  const { titulo, artista, url, plataforma } = req.body;

  if (!titulo || !url) {
    return res.status(400).json({ mensagem: 'Título e URL são obrigatórios.' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO musicas (usuario_id, titulo, artista, url, plataforma) VALUES (?, ?, ?, ?, ?)',
      [req.usuarioId, titulo, artista || null, url, plataforma || null]
    );

    const [rows] = await pool.query('SELECT * FROM musicas WHERE id = ?', [resultado.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao criar música.' });
  }
}

// PUT /api/musicas/:id
async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, artista, url, plataforma } = req.body;

  try {
    const [existente] = await pool.query(
      'SELECT id FROM musicas WHERE id = ? AND usuario_id = ?',
      [id, req.usuarioId]
    );
    if (existente.length === 0) {
      return res.status(404).json({ mensagem: 'Música não encontrada.' });
    }

    await pool.query(
      'UPDATE musicas SET titulo = ?, artista = ?, url = ?, plataforma = ? WHERE id = ?',
      [titulo, artista || null, url, plataforma || null, id]
    );

    const [rows] = await pool.query('SELECT * FROM musicas WHERE id = ?', [id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar música.' });
  }
}

// DELETE /api/musicas/:id
async function deletar(req, res) {
  const { id } = req.params;

  try {
    const [existente] = await pool.query(
      'SELECT id FROM musicas WHERE id = ? AND usuario_id = ?',
      [id, req.usuarioId]
    );
    if (existente.length === 0) {
      return res.status(404).json({ mensagem: 'Música não encontrada.' });
    }

    await pool.query('DELETE FROM musicas WHERE id = ?', [id]);
    return res.json({ mensagem: 'Música deletada com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao deletar música.' });
  }
}

module.exports = { listar, criar, atualizar, deletar };
