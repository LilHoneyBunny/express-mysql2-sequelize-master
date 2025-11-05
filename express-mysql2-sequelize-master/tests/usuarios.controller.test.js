jest.mock('../models/Usuario', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
}));

const Usuario = require('../models/Usuario');
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Controllers de usuarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearUsuario', () => {
    test('devuelve 400 si faltan campos obligatorios', async () => {
      const req = { body: { nombre: '', email: '', pass: '' } };
      const res = mockResponse();

      await crearUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errores: expect.arrayContaining([
          'El nombre es obligatorio',
          'El email es obligatorio',
          'La contraseña es obligatoria'
        ])
      });
      expect(Usuario.create).not.toHaveBeenCalled();
    });

    test('crea usuario y devuelve 201 si los datos son válidos', async () => {
      const req = {
        body: {
          nombre: 'Lilly',
          email: 'lilly@example.com',
          pass: '123456'
        }
      };
      const res = mockResponse();

      const mockUsuario = {
        id: 1,
        nombre: 'Lilly',
        email: 'lilly@example.com',
        pass: '123456',
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          nombre: 'Lilly',
          email: 'lilly@example.com'
        })
      };
      Usuario.create.mockResolvedValue(mockUsuario);

      await crearUsuario(req, res);

      expect(Usuario.create).toHaveBeenCalledWith(expect.objectContaining({
        nombre: 'Lilly',
        email: 'lilly@example.com',
        pass: expect.stringMatching(/^\$2[ayb]\$.{56}$/)  // Regex para comprobar el hash bcrypt
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUsuario.toJSON());
    });
  });

  describe('actualizarUsuario', () => {
    test('devuelve 400 si no se pasa id', async () => {
      const req = { params: {}, body: {} };
      const res = mockResponse();

      await actualizarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'El id es obligatorio'
      });
      expect(Usuario.update).not.toHaveBeenCalled();
    });

    test('devuelve 404 si no se encuentra el usuario', async () => {
      const req = { params: { id: '10' }, body: { nombre: 'Nuevo' } };
      const res = mockResponse();

      Usuario.update.mockResolvedValue([0]); // 0 filas actualizadas

      await actualizarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario no encontrado'
      });
    });
  });

  describe('eliminarUsuario', () => {
    test('devuelve 404 si no se encontró el usuario a eliminar', async () => {
      const req = { params: { id: '20' } };
      const res = mockResponse();

      Usuario.destroy.mockResolvedValue(0); // 0 filas eliminadas

      await eliminarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario no encontrado'
      });
    });
  });
});
