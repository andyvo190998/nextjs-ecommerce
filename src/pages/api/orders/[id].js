const { default: Order } = require('@/components/models/Order');
const { default: db } = require('@/utils/db');
const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await db.connect();

  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
};

export default handler;
