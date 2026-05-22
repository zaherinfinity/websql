import connectDB from '../../../lib/db';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();
  const user = await protect(req, res);
  if (!user) return; // protect already sent the 401 response

  res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
}
