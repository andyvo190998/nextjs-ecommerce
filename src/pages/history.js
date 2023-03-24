import Layout from '@/components/Layout';
import { getError } from '@/utils/error';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

const OrderHistoryScreen = () => {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title='Order History'>
      {orders.length === 0 ? '' : <h1>Order History</h1>}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            {orders.length === 0 ? (
              <div>Order history is empty</div>
            ) : (
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>ID</th>
                  <th className='px-5 text-right'>DATE</th>
                  <th className='px-5 text-right'>TOTAL</th>
                  <th className='px-5 text-right'>PAID</th>
                  <th className='px-5 text-right'>DELIVERED</th>
                  <th className='px-5 text-right'>ACTION</th>
                </tr>
              </thead>
            )}

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className='border-b'>
                  <td className='p-5 '>{order._id.substring(20, 24)}</td>
                  <td className='p-5 text-right'>
                    {order.createdAt.substring(5, 10)}
                  </td>
                  <td className='p-5 text-right'>${order.totalPrice}</td>
                  <td className='p-5 text-right'>
                    {order.isPaid
                      ? `${order.paidAt.subString(0, 10)}`
                      : 'not paid'}
                  </td>
                  <td className='p-5 text-right'>
                    {order.isDelivered
                      ? `${order.deliveredAt.subString(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className='p-5 text-right'>
                    <Link href={`/order/${order._id}`} passHref>
                      <span>Detail</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
