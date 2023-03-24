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

  const saveItem = async () => {
    console.log('saved');
  };
  return (
    <div className='card'>
      <Link href={`/product/${product._id}`}>
        <span>
          <img
            src={product.image}
            alt={product.name}
            className='rounded shadow'
          />
        </span>
      </Link>
      <div className='flex flex-col items-center justify-center p-5'>
        <Link href={`/product/${product._id}`}>
          <span>
            <h2 className='text-lg'>{product.name}</h2>
          </span>
        </Link>
        <p className='mb-2'>{product.brand}</p>
        <p>${product.price}</p>
        <div>
          <button
            onClick={() => addToCartHandler(product)}
            className='primary-button'
            type='button'
          >
            Add to cart
          </button>
          <button
            onClick={() => saveItem(product)}
            className='primary-button ml-2'
            type='button'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
