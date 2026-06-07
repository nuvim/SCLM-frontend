const { pool } = require('../config/banco');

// GET /api/links
async function listar(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        l.id_link,
        l.titulo_link,
        l.url,
        l.observacao,
        c.nome_categoria AS categoria
      FROM usuario_link ul
      JOIN link l ON l.id_link = ul.id_link
      LEFT JOIN categoria c ON c.id_categoria = l.id_categoria
      WHERE ul.id_usuario = ?
      ORDER BY l.id_link DESC
    `, [req.usuarioId]);

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar links.' });
  }
}

// POST /api/links
async function criar(req, res) {
  const { titulo_link, url, observacao, nome_categoria } = req.body;

  if (!url) {
    return res.status(400).json({ mensagem: 'URL é obrigatória.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // busca ou cria categoria vinculada ao usuário
    let id_categoria = null;
    if (nome_categoria) {
      const [categorias] = await conn.query(
        'SELECT id_categoria FROM categoria WHERE nome_categoria = ? AND id_usuario = ?',
        [nome_categoria, req.usuarioId]
      );
      if (categorias.length > 0) {
        id_categoria = categorias[0].id_categoria;
      } else {
        const [novaCategoria] = await conn.query(
          'INSERT INTO categoria (nome_categoria, id_usuario) VALUES (?, ?)',
          [nome_categoria, req.usuarioId]
        );
        id_categoria = novaCategoria.insertId;
      }
    }

    // cria o link
    const [novoLink] = await conn.query(
      'INSERT INTO link (titulo_link, url, observacao, id_categoria) VALUES (?, ?, ?, ?)',
      [titulo_link || null, url, observacao || null, id_categoria]
    );
    const id_link = novoLink.insertId;

    // vincula ao usuário
    await conn.query(
      'INSERT INTO usuario_link (id_usuario, id_link) VALUES (?, ?)',
      [req.usuarioId, id_link]
    );

    await conn.commit();

    const [link] = await pool.query(`
      SELECT l.*, c.nome_categoria AS categoria
      FROM link l
      LEFT JOIN categoria c ON c.id_categoria = l.id_categoria
      WHERE l.id_link = ?
    `, [id_link]);

    return res.status(201).json(link[0]);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao criar link.' });
  } finally {
    conn.release();
  }
}

// PUT /api/links/:id
async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo_link, url, observacao, nome_categoria } = req.body;

  const conn = await pool.getConnection();
  try {
    const [pertence] = await conn.query(
      'SELECT id_link FROM usuario_link WHERE id_usuario = ? AND id_link = ?',
      [req.usuarioId, id]
    );
    if (pertence.length === 0) {
      conn.release();
      return res.status(404).json({ mensagem: 'Link não encontrado.' });
    }

    await conn.beginTransaction();

    let id_categoria = null;
    if (nome_categoria) {
      const [categorias] = await conn.query(
        'SELECT id_categoria FROM categoria WHERE nome_categoria = ? AND id_usuario = ?',
        [nome_categoria, req.usuarioId]
      );
      if (categorias.length > 0) {
        id_categoria = categorias[0].id_categoria;
      } else {
        const [novaCategoria] = await conn.query(
          'INSERT INTO categoria (nome_categoria, id_usuario) VALUES (?, ?)',
          [nome_categoria, req.usuarioId]
        );
        id_categoria = novaCategoria.insertId;
      }
    }

    await conn.query(
      'UPDATE link SET titulo_link = ?, url = ?, observacao = ?, id_categoria = ? WHERE id_link = ?',
      [titulo_link || null, url, observacao || null, id_categoria, id]
    );

    await conn.commit();

    const [link] = await pool.query(`
      SELECT l.*, c.nome_categoria AS categoria
      FROM link l
      LEFT JOIN categoria c ON c.id_categoria = l.id_categoria
      WHERE l.id_link = ?
    `, [id]);

    return res.json(link[0]);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar link.' });
  } finally {
    conn.release();
  }
}

// DELETE /api/links/:id
async function deletar(req, res) {
  const { id } = req.params;

  try {
    const [pertence] = await pool.query(
      'SELECT id_link FROM usuario_link WHERE id_usuario = ? AND id_link = ?',
      [req.usuarioId, id]
    );
    if (pertence.length === 0) {
      return res.status(404).json({ mensagem: 'Link não encontrado.' });
    }

    await pool.query('DELETE FROM usuario_link WHERE id_link = ?', [id]);
    await pool.query('DELETE FROM link WHERE id_link = ?', [id]);

    return res.json({ mensagem: 'Link deletado com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao deletar link.' });
  }
}

module.exports = { listar, criar, atualizar, deletar };
