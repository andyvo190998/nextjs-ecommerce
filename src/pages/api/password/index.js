import User from '@/components/models/User';
import db from '@/utils/db';
import bcrypt from 'bcryptjs';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    console.log('update user password');

    const session = await getSession({ req });

    if (!session) {
      return res.status(404).send({ message: 'Login required' });
    }

    await db.connect();

    const data = await User.findById(session.user._id);

    const isValid = bcrypt.compareSync(req.body.oldPassword, data.password);

    if (!isValid) {
      return res.status(401).send({ message: 'Old password is wrong!' });
    } else {
      await User.findByIdAndUpdate(session.user._id, {
        password: bcrypt.hashSync(req.body.newPassword, 12),
      });

      return res.send({ message: 'Updating password successfully!' });
    }
  }
};

export default handler;
