/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/Layout';
import { Store } from '@/utils/store';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const CartPage = () => {
  const { dispatch } = useContext(Store);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/cart');
      setCartItems(data.cart);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // const cartItems = [];
  const router = useRouter();

  const removeItemHandler = async (item) => {
    const { data } = await axios.put(`/api/cart/${item.itemId}`);
    setCartItems(data.cart);
    dispatch({ type: 'REMOVE_ITEM', payload: data.cart });
  };

  const { data: session } = useSession();

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get('/api/cart');

    const existItem = data.cart.find((i) => i.itemId === item.itemId);

    if (existItem) {
      const updateQuantity = {
        itemId: item.itemId,
        quantity: quantity,
      };
      try {
        const { data } = await axios.put('/api/cart', updateQuantity);
        dispatch({
          type: 'CART_ADD_ITEM',
          payload: data.cart,
        });
        setCartItems(data.cart);

        toast.success('Updating successfully');
      } catch (error) {
        toast.error(error.response.data);
      }
    }

    // const { data } = await axios.get(`/api/products/${item._id}`);
    // if (data.countInStock < quantity) {
    //   return toast.error('Sorry out of stock');
    // }
    // dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    // toast.success('updated successfully');
  };

  const handleCheckOut = () => {
    // () => router.push('login?redirect=/shipping');
    if (session) {
      router.push('/shipping');
    } else {
      alert('Login required');
    }
  };

  return (
    <Layout title='Shopping Cart'>
      <h1 className='mb-4 text-xl'>Shopping Cart</h1>
      {!cartItems ? (
        <div>
          Cart is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>Item</th>
                  <th className='p-5 text-right'>Quantity</th>
                  <th className='p-5 text-right'>Price</th>
                  <th className='p-5'>action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.itemId} className='border-b'>
                    <td>
                      <Link
                        href={`/product/${item.itemId}`}
                      >
                        <span className='flex items-center'>
                          <img
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td className='p-5 text-right'>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                        {/* <option>{item.quantity}</option> */}
                      </select>
                    </td>
                    <td className='p-5 text-right'>
                      ${item.price * item.quantity}
                    </td>
                    <td className='p-5 text-center'>
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className='h-5 w-5'></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5'>
            <ul>
              <li>
                <div className='pb-3 text-xl'>
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={handleCheckOut}
                  className='primary-button w-full'
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });

// export async function getServerSideProps(context) {
//   const { params, req, res } = context;

//   const { data } = await axios.get('/api/cart');

//   return {
//     props: {
//       cart: data,
//     },
//   };
// }
