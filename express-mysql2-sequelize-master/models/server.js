// models/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const usuariosRoutes = require('../routes/usuarios'); // Asegúrate de que esté importando las rutas correctamente

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json()); // Para analizar los cuerpos en formato JSON
  }

  routes() {
    this.app.use('/api/usuarios', usuariosRoutes); // Aquí se registran las rutas
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
