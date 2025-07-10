const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.verifyTokenAndAuthorize = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.auth_token ;

   

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: 'Invalid or expired token' });
      }

      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ msg: 'Forbidden: Access denied' });
      }

      next();
    });
  };
};
