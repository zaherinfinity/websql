import connectDB from '../../../lib/db';
import User from '../../../models/User';
import { signToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    setTokenCookie(res, token);
    res.status(200).json({ status: 'success', user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
