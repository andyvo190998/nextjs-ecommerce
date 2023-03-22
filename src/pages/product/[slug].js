import Layout from '@/components/Layout';
import Product from '@/components/models/Product';
import db from '@/utils/db';
import { Store } from '@/utils/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductScreen = (props) => {
  const { product } = props;

  const { dispatch } = useContext(Store);

  if (!product) {
    return <Layout title='Not found product'>Product Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get('/api/cart');

    const newItem = {
      itemId: product._id,
      quantity: 1,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
    };

    if (!data) {
      console.log('cart is not exist');
      toast.success('Adding successfully');
      const { data } = await axios.post('/api/cart', newItem);
      dispatch({
        type: 'CART_ADD_ITEM',
        payload: data.cart,
      });
    } else {
      const existItem = data.cart.find((item) => item.itemId === product._id);

      if (existItem) {
        const updateQuantity = {
          itemId: product._id,
          quantity: existItem.quantity + 1,
        };
        try {
          const { data } = await axios.put('/api/cart', updateQuantity);
          dispatch({
            type: 'CART_ADD_ITEM',
            payload: data.cart,
          });
          toast.success('Adding successfully');
        } catch (error) {
          toast.error(error.response.data);
        }
      } else {
        toast.success('Adding successfully');
        const { data } = await axios.post('/api/cart', newItem);
        dispatch({
          type: 'CART_ADD_ITEM',
          payload: data.cart,
        });
      }
    }
  };
  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href='/'>Back to products</Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout='responsive'
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Category: {product.name}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              onClick={addToCartHandler}
              className='primary-button w-full'
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;

export const getServerSideProps = async (context) => {
  const slug = context.params.slug;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
};
