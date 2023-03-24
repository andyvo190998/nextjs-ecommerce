import Layout from '@/components/Layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';

const AddNewItemForm = () => {
  const nameInput = useRef();
  const categoryInput = useRef();
  const imageInput = useRef();
  const priceInput = useRef();
  const brandInput = useRef();
  const descriptionInput = useRef();
  const countInStockInput = useRef();

  const { data: session } = useSession();

  const addNewItem = async (e) => {
    e.preventDefault();

    const newItemInput = {
      name: nameInput.current.value,
      image: imageInput.current.value,
      slug: nameInput.current.value.split(' ').join('-').toLowerCase(),
      category: categoryInput.current.value,
      price: priceInput.current.value.toString(),
      brand: brandInput.current.value,
      description: descriptionInput.current.value,
      countInStock: countInStockInput.current.value,
    };
    await axios
      .post('/api/products', newItemInput)
      .then(() => {
        toast.success('New item is added successfully');
        e.target.reset();
      })
      .catch((error) => toast.error(error.message));
  };

  // <div className='alert-error'>{error}</div>

  return (
    <Layout title='Add New Item'>
      {session.user.isAdmin ? (
        <form onSubmit={addNewItem} className='mx-auto max-w-screen-md'>
          <h1 className='mb-4 text-xl'>Add New Item</h1>
          <div className='mb-4'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              ref={nameInput}
              className='w-full'
              id='name'
              autoFocus
            ></input>
          </div>
          <div className='mb-4'>
            <label htmlFor='email'>Category</label>
            <input
              ref={categoryInput}
              type='text'
              className='w-full'
              id='email'
              autoFocus
            ></input>
          </div>
          <div className='mb-4'>
            <label htmlFor='password'>Image</label>
            <input ref={imageInput} className='w-full' autoFocus></input>
          </div>
          <div className='mb-4'>
            <label htmlFor='password'>Price</label>
            <input
              type='number'
              ref={priceInput}
              className='w-full'
              autoFocus
            ></input>
          </div>
          <div className='mb-4'>
            <label htmlFor='password'>Brand</label>
            <input ref={brandInput} className='w-full' autoFocus></input>
          </div>
          <div className='mb-4'>
            <label htmlFor='password'>Description</label>
            <input ref={descriptionInput} className='w-full' autoFocus></input>
          </div>
          <div className='mb-4'>
            <label htmlFor='password'>Count In Stock</label>
            <input
              type='number'
              ref={countInStockInput}
              className='w-full'
              autoFocus
            ></input>
          </div>
          <div className='mb-4'>
            <button className='primary-button'>Add Item</button>
          </div>
        </form>
      ) : (
        <div className='alert-error'>
          Only Admin is allowed to create new products
        </div>
      )}
    </Layout>
  );
};

export default AddNewItemForm;

AddNewItemForm.auth = true;
