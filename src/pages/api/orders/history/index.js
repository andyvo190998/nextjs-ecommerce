import Cart2 from '@/components/models/Cart';
import Order from '@/components/models/Order';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const session = await getSession({ req: req });
    if (!session) {
      return res.status(401).send({ message: 'login required!' });
    }
    await db.connect();
    const history = await Order.find({ user: session.user._id });

    await db.disconnect();
    res.send(history);
  } else if (req.method === 'DELETE') {
    console.log('delete order');
    const session = await getSession({ req: req });
    if (!session) {
      return res.status(401).send({ message: 'Login required' });
    }

    await db.connect();

    const result = await Cart2.findOneAndDelete({ user: session.user._id });
    return res.send(result);
  }
};

export default handler;
