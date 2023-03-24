import Order from '@/components/models/Order';
import db from '@/utils/db';

const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await db.connect();
  if (session.user.isAdmin) {
    await db.disconnect();
    const order = await Order.findById(req.query.id);
    res.send(order);
  } else {
    const order = await Order.findOne({ user: session.user._id });
    await db.disconnect();
    res.send(order);
  }
};

export default handler;
