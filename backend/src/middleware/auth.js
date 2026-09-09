import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cambiar';

// Middleware que protege rutas: exige un token JWT válido en el header
// Authorization: Bearer <token>
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado. Falta el token.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, name }
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}
