const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходимо авторизоваться'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthError('Необходимо авторизоваться'));
  }
  req.user = payload;
  next();
};
