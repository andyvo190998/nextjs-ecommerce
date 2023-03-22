/* eslint-disable @next/next/no-img-element */
import { Store } from '@/utils/store';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

const ProductItem = ({ product }) => {
  // const router = useRouter();
  const { dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const stock = await axios.get(`/api/products/${product._id}`);
    const { data } = await axios.get('/api/cart');

    const newItem = {
      itemId: product._id,
      quantity: 1,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: stock.data.countInStock,
    };

    if (!data) {
      console.log('cart is not exist');
      toast.success('Adding successfully');
      const { data } = await axios.post('api/cart', newItem);
      dispatch({
        type: 'CART_ADD_ITEM',
        payload: data.cart,
      });
    } else {
      const existItem = data.cart.find((item) => item.itemId === product._id);
      // setQuantityStock(data.cart.find((item) => item.itemId === product._id));
      if (existItem) {
        const updateQuantity = {
          itemId: product._id,
          quantity: existItem.quantity + 1,
        };
        // toast.success('Adding successfully');
        // const { data } = await axios.put('api/cart', updateQuantity);
        // dispatch({
        //   type: 'CART_ADD_ITEM',
        //   payload: data.cart,
        // });
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
        const { data } = await axios.post('api/cart', newItem);
        toast.success('Adding successfully');
        dispatch({
          type: 'CART_ADD_ITEM',
          payload: data.cart,
        });
      }
    }
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
