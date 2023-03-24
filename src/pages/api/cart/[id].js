import Cart2 from '@/components/models/Cart';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const session = await getSession({ req: req });

    if (!session) {
      return res.status(401).send('signin required');
    }
    console.log(id, session.user._id);

    await db.connect();
    const data = await Cart2.findOneAndUpdate(
      {
        user: session.user._id,
      },
      { $pull: { cart: { itemId: id } } },
      { returnOriginal: false }
    );
    res.status(201).send(data);

    await db.disconnect();
    return;
  }
  const session = await getSession({ req: req });

  if (!session) {
    return res.status(401).send('signin required');
  }
  await db.connect();
  const data = await Cart2.findOne({
    cart: { $elemMatch: { itemId: req.query.id } },
    user: session.user._id,
  });
  res.status(201).send(data);
  await db.disconnect();
};

export default handler;
