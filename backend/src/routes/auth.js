import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

// Quita el hash antes de enviar el usuario al frontend
function publicUser(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
}

// POST /api/auth/register  -> registrar usuario
router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese email.' });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name.trim(), email.toLowerCase().trim(), password_hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json({ message: 'Usuario registrado con éxito.', user: publicUser(user) });
});

// POST /api/auth/login  -> iniciar sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  // Registrar el login exitoso
  db.prepare(
    "UPDATE users SET login_count = login_count + 1, last_login_at = datetime('now') WHERE id = ?"
  ).run(user.id);

  const fresh = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  const token = signToken(fresh);

  return res.json({ message: 'Login exitoso.', token, user: publicUser(fresh) });
});

// GET /api/auth/me  -> datos del usuario autenticado
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
  return res.json({ user: publicUser(user) });
});

export default router;
