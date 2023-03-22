import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '@/utils/store';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getError } from '@/utils/error';
import Cookies from 'js-cookie';
import axios from 'axios';

const PlaceOrderScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/cart');
      setCartItems([...data.cart]);
    };
    getData();
    console.log(cartItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const price = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const itemPrice = round2(price);

  //   const shippingPrice = itemPrice > 200 ? 0 : 15;

  var shippingPrice;
  if (itemPrice > 200) {
    shippingPrice = 0;
  } else {
    shippingPrice = 15;
  }

  const taxPrice = round2(itemPrice * 0.15);

  const totalPrice = round2(itemPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemPrice: itemPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    // <></>
    <Layout title='Place Order'>
      <CheckoutWizard activeStep={3} />
      <h1 className='mb-4 text-xl'>Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.post},{' '}
                {shippingAddress.country}
              </div>
              <div className='mt-4'>
                <Link href='/shipping'>Edit</Link>
              </div>
            </div>

            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              <div className='mt-4'>
                <Link href='/payment'>Edit</Link>
              </div>
            </div>

            <div className='overflow-x-auto card p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='p-5 text-right'>Quantity</th>
                    <th className='p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Stubtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className='border-b'>
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <span className='flex items-center'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
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
              <div className='mb-5 mt-5'>
                <Link href='/cart'>Edit</Link>
              </div>
            </div>
          </div>

          <div className='card p-5'>
            <h2 className='mb-2 text-lg'>Order Summary</h2>
            <ul>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Items</div>
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
                  <div>Shipping</div>
                  <div>${shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Total</div>
                  <div>${totalPrice}</div>
                </div>
              </li>
              <li>
                <button
                  disabled={loading}
                  onClick={placeOrderHandler}
                  className='primary-button w-full'
                >
                  {loading ? 'Loading...' : 'Place Order'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlaceOrderScreen;
PlaceOrderScreen.auth = true;
