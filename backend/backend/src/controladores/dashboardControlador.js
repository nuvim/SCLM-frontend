const { pool } = require('../config/banco');

// GET /api/dashboard
async function obterEstatisticas(req, res) {
  try {
    const [[{ totalMusicas }]] = await pool.query(
      'SELECT COUNT(*) as totalMusicas FROM musicas WHERE usuario_id = ?',
      [req.usuarioId]
    );

    const [[{ totalLinks }]] = await pool.query(
      'SELECT COUNT(*) as totalLinks FROM links WHERE usuario_id = ?',
      [req.usuarioId]
    );

    const [ultimasMusicas] = await pool.query(
      'SELECT * FROM musicas WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 5',
      [req.usuarioId]
    );

    const [ultimosLinks] = await pool.query(
      'SELECT * FROM links WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 5',
      [req.usuarioId]
    );

    return res.json({
      totalMusicas,
      totalLinks,
      ultimasMusicas,
      ultimosLinks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao carregar dashboard.' });
  }
}

module.exports = { obterEstatisticas };
