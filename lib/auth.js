import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
}

export function setTokenCookie(res, token) {
  res.setHeader('Set-Cookie', serialize('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  }));
}

export async function protect(req, res) {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401).json({ message: 'Not authenticated' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    return user;
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return null;
  }
}
