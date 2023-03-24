import Order from '@/components/models/Order';
import db from '@/utils/db';
const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
  if (req.method === 'GET') {
    console.log('get all order');
    const session = await getSession({ req });

    if (!session.user.isAdmin) {
      return res
        .status(401)
        .send({ message: 'Only admin is allowed to see all orders!' });
    }

    await db.connect();
    const data = await Order.find({});
    return res.send(data);
  }
};

export default handler;
