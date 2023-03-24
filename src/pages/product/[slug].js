/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/Layout';
import Product from '@/components/models/Product';
import db from '@/utils/db';
import { Store } from '@/utils/store';
import Link from 'next/link';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCT':
      return action.payload;

    default:
      return state;
  }
};

const ProductScreen = (props) => {
  const { product, admin } = props;

  const [item, setItem] = useState();

  const [state, dispatch1] = useReducer(reducer, product);

  useEffect(() => {
    setItem(product);
  }, [product]);

  const { dispatch } = useContext(Store);

  const router = useRouter();

  if (!product) {
    return <Layout title='Not found product'>Product Not Found</Layout>;
  }

  //Dialog
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    handleClickOpen();
  };

  const deleteItem = async () => {
    const { data } = await axios.delete(`/api/products/${product._id}`);
    setOpen(false);

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: data.cart,
    });
    router.push('/');
  };

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

  const handleOnChange = (e) => {
    // const value = e.target.value;
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const updateItem = async () => {
    setOpen(false);
    const { data } = await axios.put('/api/products', item);
    dispatch1({ type: 'UPDATE_PRODUCT', payload: data });
  };
  return (
    <Layout title={state.name}>
      <div className='py-2'>
        <Link href='/'>Back to products</Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <img
            src={state.image}
            alt={state.name}
            width={640}
            height={640}
            layout='responsive'
          ></img>
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{state.name}</h1>
            </li>
            <li>Category: {state.category}</li>
            <li>Brand: {state.brand}</li>
            <li>
              {state.rating} of {state.numReviews} reviews
            </li>
            <li>Description: {state.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${state.price}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{state.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>

            {admin ? (
              <button onClick={handleEdit} className='primary-button w-full'>
                Edit Item
              </button>
            ) : (
              <button
                onClick={addToCartHandler}
                className='primary-button w-full'
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div>
          <Button variant='outlined' onClick={handleClickOpen}>
            Open form dialog
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Item</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin='dense'
                label='Item Name'
                type='text'
                name='name'
                fullWidth
                variant='standard'
                value={item.name}
                onChange={handleOnChange}
              />
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Category'
                name='category'
                type='text'
                value={item.category}
                fullWidth
                variant='standard'
                onChange={handleOnChange}
              />
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='image'
                name='image'
                type='text'
                fullWidth
                variant='standard'
                value={item.image}
                onChange={handleOnChange}
              />
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Price'
                name='price'
                type='number'
                fullWidth
                variant='standard'
                value={item.price}
                onChange={handleOnChange}
              />
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Brand'
                name='brand'
                type='text'
                fullWidth
                variant='standard'
                onChange={handleOnChange}
                value={item.brand}
              />
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Description'
                name='description'
                type='text'
                fullWidth
                variant='standard'
                onChange={handleOnChange}
                value={item.description}
              />
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Count In Stock'
                name='countInStock'
                type='number'
                fullWidth
                variant='standard'
                onChange={handleOnChange}
                value={item.countInStock}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={deleteItem}>Delete</Button>
              <Button onClick={updateItem}>Update</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Layout>
  );
};

export default ProductScreen;

export const getServerSideProps = async (context) => {
  const slug = context.params.slug;
  const session = await getSession({ req: context.req });

  await db.connect();
  const product = await Product.findById(slug).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
      admin: session.user.isAdmin ? true : null,
    },
  };
};
