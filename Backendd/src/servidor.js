require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testarConexao } = require('./config/banco');

const rotasAuth = require('./rotas/auth');
const rotasMusicas = require('./rotas/musicas');
const rotasLinks = require('./rotas/links');
const rotasDashboard = require('./rotas/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.URL_FRONTEND }));
app.use(express.json());

// Rotas
app.use('/api/auth', rotasAuth);
app.use('/api/musicas', rotasMusicas);
app.use('/api/links', rotasLinks);
app.use('/api/dashboard', rotasDashboard);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hora: new Date().toISOString() });
});

// Inicializar
async function inicializar() {
  await testarConexao();
  app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
  });
}

inicializar();
