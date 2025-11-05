const { Router } = require('express');
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios');

const router = Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     description: Obtiene una lista de usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', obtenerUsuarios); // Ruta para obtener todos los usuarios

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     description: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       400:
 *         description: Error al crear el usuario
 */
router.post('/register', crearUsuario); // Ruta para registrar un nuevo usuario

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     description: Actualiza los datos de un usuario por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Error al actualizar el usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', actualizarUsuario); // Ruta para actualizar un usuario

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     description: Elimina un usuario por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', eliminarUsuario); // Ruta para eliminar un usuario

module.exports = router;
