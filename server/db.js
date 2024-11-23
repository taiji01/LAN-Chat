import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'chat.db'));

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const registerUser = (username, password, avatar) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)');
    const result = stmt.run(username, hashedPassword, avatar);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Username already exists' };
    }
    throw error;
  }
};

export const loginUser = (username, password) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return { success: false, error: 'Invalid password' };
  }

  return { 
    success: true, 
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar
    }
  };
};

export default db;