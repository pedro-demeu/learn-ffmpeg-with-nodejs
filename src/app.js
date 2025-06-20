const express = require("express");
const cors = require("cors");
const path = require('path');
const config = require('./config/app');
const ffmpegRoutes = require('./routes/ffmpegRoutes');

// Inicialização da aplicação
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use("/streams", express.static(path.join(__dirname, '..', 'streams')));

// Rotas
app.use('/api/ffmpeg', ffmpegRoutes);

// Iniciar o servidor
app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}!`);
});

module.exports = app;
