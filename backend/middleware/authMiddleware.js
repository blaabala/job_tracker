const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  try {
    // 1. Get token from request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to the request object
    req.user = decoded;

    // 5. Move on to the next function
    next();

  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;