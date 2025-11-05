const request = require('supertest');
const Server = require('../../server');
jest.mock('../models/Usuario', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
}));

// Mockeamos el middleware de JWT para que no se necesite un token real
jest.mock('../middlewares/validar-jwt', () => ({
  validarJWT: jest.fn((req, res, next) => next()),  // Simula un token válido
}));

const Usuario = require('../models/Usuario');
const { actualizarUsuario, eliminarUsuario } = require('../controllers/usuarios');  // Asegúrate de importar las funciones

let app;

beforeAll(() => {
  const server = new Server();
  app = server.app; // Usamos la instancia de express sin llamar listen()
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Rutas /api/usuarios', () => {
  test('POST /api/usuarios/register devuelve 400 si faltan campos', async () => {
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Sin email', pass: '123' })
      .expect(400);

    expect(res.body.errores).toContain('El email es obligatorio');
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  test('POST /api/usuarios/register crea usuario cuando el body es válido', async () => {
    const body = { nombre: 'Nuevo', email: 'nuevo@example.com', pass: '123456' };
    const creado = { id: 1, ...body };

    Usuario.create.mockResolvedValue(creado);

    const res = await request(app)
      .post('/api/usuarios/register')
      .send(body)
      .expect(201);

    expect(Usuario.create).toHaveBeenCalledWith(body);
    expect(res.body).toEqual(creado);
  });

  test('GET /api/usuarios devuelve lista de usuarios', async () => {
    const usuarios = [{ id: 1, nombre: 'Lilly', email: 'lilly@example.com' }];
    Usuario.findAll.mockResolvedValue(usuarios);

    const res = await request(app)
      .get('/api/usuarios')
      .expect(200);

    expect(Usuario.findAll).toHaveBeenCalled();
    expect(res.body).toEqual(usuarios);
  });

  test('PUT /api/usuarios/:id actualiza usuario', async () => {
    const req = { params: { id: '1' }, body: { nombre: 'Nuevo Nombre' } };
    const res = mockResponse();

    Usuario.update.mockResolvedValue([1]); // 1 fila actualizada

    await actualizarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario actualizado correctamente' });
  });

  test('DELETE /api/usuarios/:id elimina usuario', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    Usuario.destroy.mockResolvedValue(1); // 1 fila eliminada

    await eliminarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario eliminado correctamente' });
  });
});

// Función mockResponse para simular el objeto res de Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
