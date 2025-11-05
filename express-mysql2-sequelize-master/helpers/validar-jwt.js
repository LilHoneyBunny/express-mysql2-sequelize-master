const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRETORPRIVATEKEY);
};

module.exports = { verifyToken };
