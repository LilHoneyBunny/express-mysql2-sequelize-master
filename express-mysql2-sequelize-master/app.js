require('dotenv').config();
const sequelize = require('./models/database');
const Server = require('./models/server');

sequelize.sync() // Esto crea las tablas si no existen
    .then(() => {
        console.log('Conexión a la base de datos establecida');
        const server = new Server();
        server.listen();
    })
    .catch((err) => console.log('Error al conectar a la base de datos:', err));
