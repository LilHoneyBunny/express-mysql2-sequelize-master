const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

class AuthService {
    constructor() {
        // Lee las llaves desde /services/keys/
        this.privateKey = fs.readFileSync(
            path.join(__dirname, 'keys', 'private.key'),
            'utf8'
        );
        this.publicKey = fs.readFileSync(
            path.join(__dirname, 'keys', 'public.key'),
            'utf8'
        );
    }

    /**
     * Genera un JWT firmado con RS256
     * @param {Object} payload - Información a codificar en el token
     * @param {Object} [options={}] - Opciones adicionales (expiración, audiencia, etc.)
     * @returns {string} - Token JWT
     */
    generateToken(payload, options = {}) {
        const signOptions = {
            algorithm: 'RS256',
            expiresIn: options.expiresIn || '4h',   // puedes cambiar el tiempo
            issuer: options.issuer || 'tu-sistema',
            audience: options.audience || 'tus-usuarios'
        };

        return jwt.sign(payload, this.privateKey, signOptions);
    }

    /**
     * Verifica un JWT usando la public key
     * @param {string} token - Token JWT a verificar
     * @returns {Object} - Payload decodificado si es válido
     * @throws {Error} - Si el token no es válido o expiró
     */
    verifyToken(token) {
        return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
    }
}

module.exports = new AuthService();
