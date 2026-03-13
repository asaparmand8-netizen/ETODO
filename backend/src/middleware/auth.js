const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Récupère le header Authorization
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
  if (!token) return res.status(401).json({ msg: 'Token not found' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = { id: decoded.id }; // Stocke uniquement l'ID pour toutes les routes
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Helper function to generate JWT token (login token)
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn });
};

// Helper function to verify JWT token (login token)
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = authMiddleware;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
