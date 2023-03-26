import Save1 from '@/components/models/Save';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const session = await getSession({ req: req });

    if (!session) {
      return res.status(401).send({ message: 'Login required' });
    }

    await db.connect();
    const { id } = req.query;

    const data = await Save1.findOneAndUpdate(
      {
        user: session.user._id,
        'item.itemId': id,
      },
      { $pull: { item: { itemId: id } } },
      { returnOriginal: false }
    );
    return res.send(data);
  }
};

export default handler;
