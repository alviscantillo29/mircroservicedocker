import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard/logged-users
// Lista de usuarios que han iniciado sesión con éxito (al menos una vez),
// ordenados por el login más reciente.
router.get('/logged-users', requireAuth, (req, res) => {
  const users = db
    .prepare(
      `SELECT id, name, email, login_count, last_login_at
         FROM users
        WHERE login_count > 0
        ORDER BY last_login_at DESC`
    )
    .all();
  return res.json({ users });
});

// PUT /api/dashboard/welcome-message
// Crea/actualiza el mensaje de bienvenida del usuario autenticado.
router.put('/welcome-message', requireAuth, (req, res) => {
  const { message } = req.body || {};
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'El mensaje debe ser texto.' });
  }

  db.prepare('UPDATE users SET welcome_message = ? WHERE id = ?').run(message.trim(), req.user.id);
  const user = db.prepare('SELECT id, name, email, welcome_message FROM users WHERE id = ?').get(req.user.id);

  return res.json({ message: 'Mensaje de bienvenida guardado.', user });
});

export default router;
