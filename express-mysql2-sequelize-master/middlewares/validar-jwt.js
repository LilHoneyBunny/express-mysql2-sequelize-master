//const { verifyToken } = require('../helpers/validar-jwt');
const authService = require('../Services/AuthService');



const validarJWT = (req, res, next) => {
    let token = req.header('x-token');

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        //const payload = verifyToken(token);
        const payload = authService.verifyToken(token);
        req.uid = payload.uid;
        req.jwtPayload = payload;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

module.exports = { validarJWT };
