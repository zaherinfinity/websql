import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
// In production, always set JWT_SECRET env var

// Helper to parse JSON body
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Get token from cookie
function getTokenFromCookie(req) {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// Set JWT cookie
function setTokenCookie(res, token) {
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : ''}`);
}

export default async function handler(req, res) {
  const { action } = req.query;
  const body = await parseBody(req);
  const token = getTokenFromCookie(req);
  let userId = null, username = null;

  // Verify token
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
      username = decoded.username;
    } catch (err) {}
  }

  // ---------- REGISTER ----------
  if (action === 'register') {
    const { username: uname, password: pwd } = body;
    if (!uname || !pwd) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const hashed = await bcrypt.hash(pwd, 10);
    try {
      await sql`INSERT INTO users (username, password_hash) VALUES (${uname}, ${hashed})`;
      res.json({ success: true });
    } catch (err) {
      if (err.code === '23505') res.status(400).json({ error: 'Username exists' });
      else res.status(500).json({ error: 'Server error' });
    }
    return;
  }

  // ---------- LOGIN ----------
  if (action === 'login') {
    const { username: uname, password: pwd } = body;
    const result = await sql`SELECT * FROM users WHERE username = ${uname}`;
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(pwd, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const newToken = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    setTokenCookie(res, newToken);
    res.json({ success: true });
    return;
  }

  // ---------- LOGOUT ----------
  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
    res.json({ success: true });
    return;
  }

  // ---------- CHECK SESSION ----------
  if (action === 'check') {
    if (userId) {
      res.json({ isLoggedIn: true, username });
    } else {
      res.json({ isLoggedIn: false });
    }
    return;
  }

  // ---------- SQL LIVE (requires auth) ----------
  if (action === 'sql') {
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { query } = body;
    if (!query || !query.trim().toUpperCase().startsWith('SELECT')) {
      return res.status(400).json({ error: 'Only SELECT queries allowed' });
    }
    try {
      const result = await sql.query(query);
      res.json({ rows: result.rows });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  // ---------- SETUP DATABASE (run once, protected) ----------
  if (action === 'setup') {
    // Optional: restrict to dev or a secret key
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SETUP) {
      return res.status(403).json({ error: 'Setup disabled' });
    }
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          role TEXT,
          salary INTEGER,
          department TEXT
        );
      `;
      const count = await sql`SELECT COUNT(*) FROM employees`;
      if (count.rows[0].count === '0') {
        await sql`
          INSERT INTO employees (name, role, salary, department) VALUES
          ('Alice Johnson', 'Software Engineer', 85000, 'Engineering'),
          ('Bob Smith', 'Product Manager', 95000, 'Product'),
          ('Carol Davis', 'Data Analyst', 72000, 'Analytics'),
          ('David Brown', 'QA Engineer', 68000, 'Engineering'),
          ('Emma Wilson', 'UX Designer', 78000, 'Design');
        `;
      }
      res.json({ message: 'Database ready' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.status(400).json({ error: 'Invalid action' });
}