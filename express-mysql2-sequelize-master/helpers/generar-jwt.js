const jwt = require('jsonwebtoken');
require('dotenv').config(); // opcional si ya lo haces en app.js

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '4h'
    });
};

module.exports = { generateToken };
