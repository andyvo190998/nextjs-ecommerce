import Cart2 from '@/components/models/Cart';
import { getSession } from 'next-auth/react';

const { default: Product } = require('@/components/models/Product');
const { default: db } = require('@/utils/db');

const handler = async (req, res) => {
  if (req.method === 'GET') {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();

    return res.send(product);
  } else if (req.method === 'DELETE') {
    const session = await getSession({ req: req });

    await db.connect();
    await Product.findByIdAndDelete(req.query.id);
    const data = await Cart2.findOneAndUpdate(
      {
        user: session.user._id,
      },
      { $pull: { cart: { itemId: req.query.id } } },
      { returnOriginal: false }
    );
    return res.send(data);
  }
};

export default handler;
