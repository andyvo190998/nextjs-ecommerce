import Product from '@/components/models/Product';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const session = await getSession({ req: req });
    if (!session) {
      return res.status(401).send('Login require');
    }
    const {
      name,
      image,
      price,
      description,
      slug,
      category,
      brand,
      countInStock,
    } = req.body;

    await db.connect();
    const newitem = new Product({
      name: name,
      price: price,
      slug: slug,
      image: image,
      description: description,
      category: category,
      brand: brand,
      countInStock: countInStock,
      rating: 0,
      numReviews: 0,
    });
    const result = await newitem.save();

    res.send(result);
  } else if (req.method === 'PUT') {
    console.log('Put here');
    const updateItem = req.body;
    const session = await getSession({ req: req });

    if (!session) {
      return res.status(401).send('Login require');
    }

    await db.connect();
    // const result = await Product.findOneAndUpdate(
    //   {
    //     _id: updateItem._id,
    //   },
    //   { updateItem },
    //   { returnNewDocument: true }
    // );
    const result = await Product.findByIdAndUpdate(updateItem._id, updateItem, {
      new: true,
    });
    res.send(result);
    await db.disconnect();
  }
};

export default handler;
