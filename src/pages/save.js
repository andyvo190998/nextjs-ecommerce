/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/Layout';
import { Store } from '@/utils/store';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { toast } from 'react-toastify';

const SaveScreen = () => {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    const getSavedItem = async () => {
      const { data } = await axios.get('/api/save');
      if (!data) {
        return;
      } else {
        dispatch({
          type: 'SAVE_ITEM',
          payload: data.item,
        });
      }
    };
    getSavedItem();
  }, [dispatch]);

  const removeItemHandler = async (item) => {
    const itemId = item.itemId;

    const { data } = await axios.put(`/api/save/${itemId}`);
    dispatch({
      type: 'SAVE_ITEM',
      payload: data.item,
    });
  };

  const addToCart = async (item) => {
    const stock = await axios.get(`/api/products/${item._id}`);
    const { data } = await axios.get('/api/cart');

    const newItem = {
      itemId: item._id,
      quantity: 1,
      name: item.name,
      image: item.image,
      price: item.price,
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
      const existItem = data.cart.find((i) => i.itemId === item._id);
      // setQuantityStock(data.cart.find((item) => item.itemId === product._id));
      if (existItem) {
        const updateQuantity = {
          itemId: item._id,
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


  return (
    <Layout title='Saved Item'>
      <h1 className='mb-4 text-xl'>Saved Item</h1>
      {state.saveItem.length === 0 ? (
        <div>
          Saved list is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-3 text-left'>Item</th>
                  <th className='p-5'>Price</th>
                  <th className='p-5'>action</th>
                </tr>
              </thead>

              <tbody>
                {state.saveItem.map((item) => (
                  <tr key={item._id} className='border-b'>
                    <td>
                      <Link href={`/product/${item._id}`}>
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
                    <td className='p-5 text-center'>${item.price}</td>
                    <td className='p-5 text-center'>
                      <button onClick={() => addToCart(item)}>
                        <AddCircleOutlineIcon className='h-5 w-5'></AddCircleOutlineIcon>
                      </button>
                      <button onClick={() => removeItemHandler(item)}>
                        <RemoveCircleOutlineIcon className='h-5 w-5'></RemoveCircleOutlineIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SaveScreen;
