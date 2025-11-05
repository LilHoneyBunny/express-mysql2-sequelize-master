const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const authService = require('../Services/AuthService'); // 👈 nuevo

// Validación básica de datos de entrada
const validarUsuarioInput = (data, { parcial = false } = {}) => {
  const errores = [];

  if (!parcial || data.nombre !== undefined) {
    if (!data.nombre || data.nombre.trim() === '') {
      errores.push('El nombre es obligatorio');
    }
  }

  if (!parcial || data.email !== undefined) {
    if (!data.email || data.email.trim() === '') {
      errores.push('El email es obligatorio');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errores.push('El email no es válido');
      }
    }
  }

  if (!parcial || data.pass !== undefined) {
    if (!data.pass || data.pass.trim() === '') {
      errores.push('La contraseña es obligatoria');
    }
  }

  return errores;
};

// POST /api/usuarios/register
const crearUsuario = async (req, res) => {
  const errores = validarUsuarioInput(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const { nombre, email, pass } = req.body;

    // ¿ya existe ese email?
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    // hash de la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(pass, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      pass: hashedPass
    });

    // ocultar el pass en la respuesta
    const { pass: _pass, ...usuarioSinPass } = usuario.toJSON();

    res.status(201).json(usuarioSinPass);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// POST /api/usuarios/login
const login = async (req, res) => {
  const { email, pass } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({
        msg: 'Email / contraseña no son correctos - email'
      });
    }

    // comparar contraseña
    const validPassword = bcrypt.compareSync(pass, usuario.pass);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Email / contraseña no son correctos - password'
      });
    }

    // generar JWT usando AuthService
    const token = authService.generateToken({
      uid: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    });

    const { pass: _pass, ...usuarioSinPass } = usuario.toJSON();

    res.json({
      usuario: usuarioSinPass,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    });
  }
};

// GET /api/usuarios  (protegido con JWT)
const obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll({
    attributes: { exclude: ['pass'] } // no mostrar la contraseña
  });
  res.json(usuarios);
};

// PUT /api/usuarios/:id  (protegido con JWT)
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // si viene pass en el body, lo volvemos a hashear
    if (data.pass) {
      const salt = bcrypt.genSaltSync(10);
      data.pass = bcrypt.hashSync(data.pass, salt);
    }

    const [updated] = await Usuario.update(data, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/usuarios/:id  (protegido con JWT)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usuario.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  crearUsuario,
  login,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
};
