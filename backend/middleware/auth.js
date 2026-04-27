const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ message: 'Authentication failed. Please login.' });
  }
};