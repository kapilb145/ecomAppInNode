// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const debug = require('debug')('jwt');
process.env.DEBUG = 'jwt';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;



  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }


  const tokenWithoutBearer = token.slice(7); // Remove "Bearer " prefix
  debug('Received Token:', tokenWithoutBearer);

  try {
    const decodedPayload = jwt.decode(tokenWithoutBearer);
    // console.log('Decoded Token Payload:', decodedPayload)
    const decodedToken = jwt.verify(tokenWithoutBearer, config.jwtSecret);
    debug('Decoded Token:', decodedToken);

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    debug('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
