const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Ajustar la ruta correcta para la importación de usuariosRoutes
const usuariosRoutes = require('./express-mysql2-sequelize-master/routes/usuarios'); 

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
    // Configurar las rutas de Swagger
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'API de Usuarios',
          version: '1.0.0',
          description: 'Documentación de la API para gestionar usuarios',
        },
        servers: [
          {
            url: 'http://localhost:3000/api',
          },
        ],
      },
       apis: ['./express-mysql2-sequelize-master/routes/*.js', './express-mysql2-sequelize-master/controllers/*.js'],
      };
    

    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    // Usar swagger-ui-express para mostrar la documentación
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Aquí se registran las rutas
    this.app.use('/api/usuarios', usuariosRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor iniciado en http://localhost:${this.port}`);  // Mensaje de log de inicio
    });
  }
}

// Inicializar el servidor directamente aquí
const server = new Server();
server.listen(); // Inicia el servidor
