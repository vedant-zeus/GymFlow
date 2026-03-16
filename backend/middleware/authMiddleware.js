const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Expected format: "Bearer <token>"
    const bearerToken = token.split(' ')[1] || token;
    
    // Verify the token using the secret key (matching authController)
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'supersecretgymflowkey_123');
    
    // Add the deeply decoded user payload back to the request object
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;
