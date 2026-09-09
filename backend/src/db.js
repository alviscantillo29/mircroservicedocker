import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Un solo archivo en la carpeta backend/. Cero configuración.
const db = new Database(join(__dirname, '..', 'data.sqlite'));
db.pragma('journal_mode = WAL');

// Esquema de la base de datos
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    password_hash   TEXT    NOT NULL,
    welcome_message TEXT    DEFAULT '',
    login_count     INTEGER NOT NULL DEFAULT 0,
    last_login_at   TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
