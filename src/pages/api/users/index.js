import User from '@/components/models/User';
import db from '@/utils/db';
import { hash } from 'bcryptjs';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const inputUser = req.body;

    await db.connect();
    const validEmail = await User.findOne({ email: inputUser.email });
    if (validEmail) {
      return res.status(409).send('email already exist');
      //   throw new SyntaxError('email already exist');
    }

    const hashedPassword = await hash(inputUser.password, 12);

    const newUser = new User({
      name: inputUser.name,
      email: inputUser.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send('register successfully');
  }
};

export default handler;
