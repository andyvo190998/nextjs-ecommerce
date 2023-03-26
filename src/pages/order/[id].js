/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/Layout';
import { getError } from '@/utils/error';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const router = useRouter();
  const orderId = router.query.id;

  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    if (!state.order._id || (state.order._id && state.order._id !== orderId)) {
      fetchOrder();
    }
  }, [orderId, state.order._id]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    taxPrice,
    shippingPrice,
    totalPrice,
    itemPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = state.order;

  return (
    // <>asd</>
    <Layout title={`Order ${orderId}`}>
      <h1 className='mb-4 text-xl'>{`Order: ${orderId}`}</h1>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div className='alert-error'>{state.error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.post}, ,{' '}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className='alert-success'>Delivered at {deliveredAt}</div>
              ) : (
                <div className='alert-error'>Not delivered</div>
              )}
            </div>

            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className='alert-success'>Paid at {paidAt}</div>
              ) : (
                <div className='alert-error'>Not Paid</div>
              )}
            </div>

            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='p-5 text-right'>Quantity</th>
                    <th className='p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className='border-b'>
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <span className='flex items-center'>
                            <img
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></img>
                            &nbsp;
                            {item.name}
                          </span>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>{item.price}</td>
                      <td className='p-5 text-right'>
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className='card p-5'>
              <h2 className='mb-2 p-5'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Item</div>
                    <div>${itemPrice}</div>
                  </div>
                </li>

                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>

                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Shipping Price</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>

                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total Price</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrderScreen;
OrderScreen.auth = true;
