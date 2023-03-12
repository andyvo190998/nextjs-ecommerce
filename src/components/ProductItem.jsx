/* eslint-disable @next/next/no-img-element */
import { Store } from '@/utils/store';
import axios from 'axios';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

const ProductItem = ({ product }) => {
  // const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log(data);

    if (data.countInStock < quantity) {
      toast.error('Product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });
    toast.success('Adding successfully');
  };
  return (
    <div className='card'>
      <Link href={`/product/${product.slug}`}>
        <span>
          <img
            src={product.image}
            alt={product.name}
            className='rounded shadow'
          />
        </span>
      </Link>
      <div className='flex flex-col items-center justify-center p-5'>
        <Link href={`/product/${product.slug}`}>
          <span>
            <h2 className='text-lg'>{product.name}</h2>
          </span>
        </Link>
        <p className='mb-2'>{product.brand}</p>
        <p>${product.price}</p>
        <button
          onClick={() => addToCartHandler(product)}
          className='primary-button'
          type='button'
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
