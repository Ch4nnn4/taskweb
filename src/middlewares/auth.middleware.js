const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  try {
    const bearerToken = token.split(' ')[1] || token;
    console.log('Token recibido:', bearerToken.substring(0, 20) + '...');
    
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    console.log('Usuario ID:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Error en token:', err.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = verifyToken;