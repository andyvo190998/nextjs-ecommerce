import Cart2 from '@/components/models/Cart';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    console.log('Cart request');
    const { itemId, quantity, image, name, price, countInStock } = req.body;
    const { user } = await getSession({ req: req });
    await db.connect();

    const existingCart = await Cart2.findOne({ user: user._id });

    if (!existingCart) {
      const newItem = await new Cart2({
        user: user._id,
        cart: [
          {
            itemId: itemId,
            quantity: quantity,
            image: image,
            price: price,
            name: name,
            countInStock: countInStock,
          },
        ],
      });
      const cart = await newItem.save();
      res.status(201).send(cart);
    } else {
      const newItem = {
        itemId: itemId,
        quantity: quantity,
        image: image,
        price: price,
        name: name,
        countInStock: countInStock,
      };
      const data = await Cart2.findOneAndUpdate(
        { user: user._id },
        { $push: { cart: newItem } },
        { returnOriginal: false }
      );
      res.status(201).send(data);
    }
  } else if (req.method === 'GET') {
    console.log('get123');
    const { user } = await getSession({ req: req });

    await db.connect();

    const cart = await Cart2.findOne({ user: user._id });
    res.status(201).send(cart);
  } else if (req.method === 'PUT') {
    console.log('Put');

    await db.connect();

    const session = await getSession({ req: req });

    const inputQuantity = req.body.quantity;

    const existingCart = await Cart2.findOne({ user: session.user._id });
    const currentItem = existingCart.cart.find(
      (item) => item.itemId === req.body.itemId
    );

    // if (currentItem.countInStock < currentItem.quantity) {
    //   if (currentItem.countInStock === currentItem.quantity) {
    //     const data = await Cart2.findOneAndUpdate(
    //       { 'cart.itemId': req.body.itemId, user: session.user._id },
    //       { $set: { 'cart.$.quantity': inputQuantity } },
    //       { returnOriginal: false }
    //     );
    //     res.status(201).send(data);
    //   }
    //   return res.status(404).send('Product is out of stock!');
    // }

    if (currentItem.countInStock <= currentItem.quantity) {
      return res.status(404).send('Product is out of stock!');
    }

    const data = await Cart2.findOneAndUpdate(
      { 'cart.itemId': req.body.itemId, user: session.user._id },
      { $set: { 'cart.$.quantity': inputQuantity } },
      { returnOriginal: false }
    );
    res.status(201).send(data);
  }
};

export default handler;
