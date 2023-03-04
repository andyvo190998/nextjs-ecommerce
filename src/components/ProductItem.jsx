/* eslint-disable @next/next/no-img-element */
import { Store } from '@/utils/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

const ProductItem = ({ product }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      alert('Product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });
    router.push('/cart');
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
          onClick={addToCartHandler}
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
