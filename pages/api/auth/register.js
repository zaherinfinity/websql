import connectDB from '../../../lib/db';
import User from '../../../models/User';
import { signToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await connectDB();
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({ status: 'success', user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
