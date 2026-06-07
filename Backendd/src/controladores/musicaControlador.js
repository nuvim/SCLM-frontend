const { pool } = require('../config/banco');

// GET /api/musicas
async function listar(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        m.id_musica,
        m.titulo_musica,
        m.url,
        m.tempo_musica,
        m.baixar,
        m.observacao,
        g.nome_genero,
        GROUP_CONCAT(DISTINCT a.nome_artista ORDER BY a.nome_artista SEPARATOR ', ') AS artistas
      FROM usuario_musica um
      JOIN musica m ON m.id_musica = um.id_musica
      LEFT JOIN genero g ON g.id_genero = m.id_genero
      LEFT JOIN artista_musica am ON am.id_musica = m.id_musica
      LEFT JOIN artista a ON a.id_artista = am.id_artista
      WHERE um.id_usuario = ?
      GROUP BY m.id_musica
      ORDER BY m.id_musica DESC
    `, [req.usuarioId]);

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar músicas.' });
  }
}

// POST /api/musicas
async function criar(req, res) {
  const { titulo_musica, url, tempo_musica, baixar, observacao, nome_genero, nome_artista } = req.body;

  if (!titulo_musica) {
    return res.status(400).json({ mensagem: 'Título da música é obrigatório.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // busca ou cria gênero
    let id_genero = null;
    if (nome_genero) {
      const [generos] = await conn.query(
        'SELECT id_genero FROM genero WHERE nome_genero = ?', [nome_genero]
      );
      if (generos.length > 0) {
        id_genero = generos[0].id_genero;
      } else {
        const [novoGenero] = await conn.query(
          'INSERT INTO genero (nome_genero) VALUES (?)', [nome_genero]
        );
        id_genero = novoGenero.insertId;
      }
    }

    // cria a música
    const [novaMusica] = await conn.query(
      'INSERT INTO musica (titulo_musica, url, tempo_musica, baixar, observacao, id_genero) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo_musica, url || null, tempo_musica || null, baixar || false, observacao || null, id_genero]
    );
    const id_musica = novaMusica.insertId;

    // vincula ao usuário
    await conn.query(
      'INSERT INTO usuario_musica (id_usuario, id_musica) VALUES (?, ?)',
      [req.usuarioId, id_musica]
    );

    // busca ou cria artista e vincula
    if (nome_artista) {
      const [artistas] = await conn.query(
        'SELECT id_artista FROM artista WHERE nome_artista = ?', [nome_artista]
      );
      let id_artista;
      if (artistas.length > 0) {
        id_artista = artistas[0].id_artista;
      } else {
        const [novoArtista] = await conn.query(
          'INSERT INTO artista (nome_artista) VALUES (?)', [nome_artista]
        );
        id_artista = novoArtista.insertId;
      }
      await conn.query(
        'INSERT INTO artista_musica (id_artista, id_musica) VALUES (?, ?)',
        [id_artista, id_musica]
      );
    }

    await conn.commit();

    const [musica] = await pool.query(`
      SELECT m.*, g.nome_genero,
        GROUP_CONCAT(DISTINCT a.nome_artista SEPARATOR ', ') AS artistas
      FROM musica m
      LEFT JOIN genero g ON g.id_genero = m.id_genero
      LEFT JOIN artista_musica am ON am.id_musica = m.id_musica
      LEFT JOIN artista a ON a.id_artista = am.id_artista
      WHERE m.id_musica = ?
      GROUP BY m.id_musica
    `, [id_musica]);

    return res.status(201).json(musica[0]);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao criar música.' });
  } finally {
    conn.release();
  }
}

// PUT /api/musicas/:id
async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo_musica, url, tempo_musica, baixar, observacao, nome_genero, nome_artista } = req.body;

  const conn = await pool.getConnection();
  try {
    // verifica se a música pertence ao usuário
    const [pertence] = await conn.query(
      'SELECT id_musica FROM usuario_musica WHERE id_usuario = ? AND id_musica = ?',
      [req.usuarioId, id]
    );
    if (pertence.length === 0) {
      conn.release();
      return res.status(404).json({ mensagem: 'Música não encontrada.' });
    }

    await conn.beginTransaction();

    // atualiza gênero
    let id_genero = null;
    if (nome_genero) {
      const [generos] = await conn.query(
        'SELECT id_genero FROM genero WHERE nome_genero = ?', [nome_genero]
      );
      if (generos.length > 0) {
        id_genero = generos[0].id_genero;
      } else {
        const [novoGenero] = await conn.query(
          'INSERT INTO genero (nome_genero) VALUES (?)', [nome_genero]
        );
        id_genero = novoGenero.insertId;
      }
    }

    await conn.query(
      'UPDATE musica SET titulo_musica = ?, url = ?, tempo_musica = ?, baixar = ?, observacao = ?, id_genero = ? WHERE id_musica = ?',
      [titulo_musica, url || null, tempo_musica || null, baixar || false, observacao || null, id_genero, id]
    );

    // atualiza artista
    if (nome_artista) {
      await conn.query('DELETE FROM artista_musica WHERE id_musica = ?', [id]);
      const [artistas] = await conn.query(
        'SELECT id_artista FROM artista WHERE nome_artista = ?', [nome_artista]
      );
      let id_artista;
      if (artistas.length > 0) {
        id_artista = artistas[0].id_artista;
      } else {
        const [novoArtista] = await conn.query(
          'INSERT INTO artista (nome_artista) VALUES (?)', [nome_artista]
        );
        id_artista = novoArtista.insertId;
      }
      await conn.query(
        'INSERT INTO artista_musica (id_artista, id_musica) VALUES (?, ?)',
        [id_artista, id]
      );
    }

    await conn.commit();

    const [musica] = await pool.query(`
      SELECT m.*, g.nome_genero,
        GROUP_CONCAT(DISTINCT a.nome_artista SEPARATOR ', ') AS artistas
      FROM musica m
      LEFT JOIN genero g ON g.id_genero = m.id_genero
      LEFT JOIN artista_musica am ON am.id_musica = m.id_musica
      LEFT JOIN artista a ON a.id_artista = am.id_artista
      WHERE m.id_musica = ?
      GROUP BY m.id_musica
    `, [id]);

    return res.json(musica[0]);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar música.' });
  } finally {
    conn.release();
  }
}

// DELETE /api/musicas/:id
async function deletar(req, res) {
  const { id } = req.params;

  try {
    const [pertence] = await pool.query(
      'SELECT id_musica FROM usuario_musica WHERE id_usuario = ? AND id_musica = ?',
      [req.usuarioId, id]
    );
    if (pertence.length === 0) {
      return res.status(404).json({ mensagem: 'Música não encontrada.' });
    }

    await pool.query('DELETE FROM usuario_musica WHERE id_musica = ?', [id]);
    await pool.query('DELETE FROM artista_musica WHERE id_musica = ?', [id]);
    await pool.query('DELETE FROM musica WHERE id_musica = ?', [id]);

    return res.json({ mensagem: 'Música deletada com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao deletar música.' });
  }
}

module.exports = { listar, criar, atualizar, deletar };
