// routes/usuarios.js
const { Router } = require('express');
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios');

const router = Router();

router.post('/', crearUsuario); // Ruta para crear un usuario
router.get('/', obtenerUsuarios); // Ruta para obtener todos los usuarios
router.put('/:id', actualizarUsuario); // Ruta para actualizar un usuario
router.delete('/:id', eliminarUsuario); // Ruta para eliminar un usuario

module.exports = router;
