const { pool } = require('../config/banco');

// GET /api/dashboard
async function obterEstatisticas(req, res) {
  try {
    const [[{ totalMusicas }]] = await pool.query(
      'SELECT COUNT(*) as totalMusicas FROM usuario_musica WHERE id_usuario = ?',
      [req.usuarioId]
    );

    const [[{ totalLinks }]] = await pool.query(
      'SELECT COUNT(*) as totalLinks FROM usuario_link WHERE id_usuario = ?',
      [req.usuarioId]
    );

    // últimas 5 músicas do usuário com artista e gênero
    const [ultimasMusicas] = await pool.query(`
      SELECT
        m.id_musica,
        m.titulo_musica,
        m.tempo_musica,
        m.baixar,
        g.nome_genero,
        GROUP_CONCAT(DISTINCT a.nome_artista SEPARATOR ', ') AS artistas
      FROM usuario_musica um
      JOIN musica m ON m.id_musica = um.id_musica
      LEFT JOIN genero g ON g.id_genero = m.id_genero
      LEFT JOIN artista_musica am ON am.id_musica = m.id_musica
      LEFT JOIN artista a ON a.id_artista = am.id_artista
      WHERE um.id_usuario = ?
      GROUP BY m.id_musica
      ORDER BY m.id_musica DESC
      LIMIT 5
    `, [req.usuarioId]);

    // últimos 5 links do usuário com categoria
    const [ultimosLinks] = await pool.query(`
      SELECT
        l.id_link,
        l.titulo_link,
        l.url,
        c.nome_categoria AS categoria
      FROM usuario_link ul
      JOIN link l ON l.id_link = ul.id_link
      LEFT JOIN categoria c ON c.id_categoria = l.id_categoria
      WHERE ul.id_usuario = ?
      ORDER BY l.id_link DESC
      LIMIT 5
    `, [req.usuarioId]);

    // distribuição por gênero para o gráfico
    const [distribuicaoGenero] = await pool.query(`
      SELECT g.nome_genero AS label, COUNT(*) AS total
      FROM usuario_musica um
      JOIN musica m ON m.id_musica = um.id_musica
      JOIN genero g ON g.id_genero = m.id_genero
      WHERE um.id_usuario = ?
      GROUP BY g.id_genero
    `, [req.usuarioId]);

    // distribuição por artista para o gráfico
    const [distribuicaoArtista] = await pool.query(`
      SELECT a.nome_artista AS label, COUNT(*) AS total
      FROM usuario_musica um
      JOIN artista_musica am ON am.id_musica = um.id_musica
      JOIN artista a ON a.id_artista = am.id_artista
      WHERE um.id_usuario = ?
      GROUP BY a.id_artista
      LIMIT 5
    `, [req.usuarioId]);

    return res.json({
      totalMusicas,
      totalLinks,
      ultimasMusicas,
      ultimosLinks,
      distribuicaoGenero,
      distribuicaoArtista,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao carregar dashboard.' });
  }
}

module.exports = { obterEstatisticas };
