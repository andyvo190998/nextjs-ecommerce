import db from '@/utils/db';
import { getSession } from 'next-auth/react';
import Save1 from '@/components/models/Save';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send({ message: 'Login required' });
    }

    await db.connect();

    const existingList = await Save1.findOne({ user: session.user._id });

    if (!existingList) {
      const saveItem = new Save1({
        user: session.user._id,
        item: [
          {
            name: req.body.name,
            itemId: req.body._id,
            slug: req.body.slug,
            category: req.body.category,
            image: req.body.image,
            price: req.body.price,
            brand: req.body.brand,
            description: req.body.description,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            countInStock: req.body.countInStock,
          },
        ],
      });

      const cart = await saveItem.save();
      return res.send(cart);
    } else {
      const saveItem = {
        name: req.body.name,
        itemId: req.body._id,
        slug: req.body._id,
        category: req.body.category,
        image: req.body.image,
        price: req.body.price,
        brand: req.body.brand,
        description: req.body.description,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        countInStock: req.body.countInStock,
      };
      const existingItem = await Save1.findOne({
        user: session.user._id,
        'item.itemId': req.body._id,
      });
      if (existingItem) {
        return res.status(401).send({ message: 'Item is existed' });
      } else {
        const data = await Save1.findOneAndUpdate(
          { user: session.user._id },
          { $push: { item: saveItem } },
          { returnOriginal: false }
        );
        res.status(201).send(data);
      }
    }
  } else if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send({ message: 'Login required' });
    }

    await db.connect();

    const data = await Save1.findOne({ user: session.user._id });

    return res.send(data);
  }
};

export default handler;
