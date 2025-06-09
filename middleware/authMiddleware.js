const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  // Pisahkan "Bearer" dan token-nya
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token salah/expired
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
