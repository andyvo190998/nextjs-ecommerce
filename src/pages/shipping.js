import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';
import { Store } from '@/utils/store';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function ShippingScreen() {
  const key = process.env.API_KEY;

  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    // getValues,
  } = useForm();
  const { dispatch, state } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('post', shippingAddress.post);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, post, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, post, country },
    });
  };
  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard activeStep={1} />
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Shipping Address</h1>
        <div className='mb-4'>
          <label htmlFor='fullName'>Full Name</label>
          <input
            className='w-full'
            id='fullName'
            autoFocus
            {...register('fullName', { required: 'pleaseEnter full name' })}
          />
          {errors.fullName && (
            <div className='text-red-500'>{errors.fullName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='address'>Address</label>
          <input
            className='w-full'
            id='address'
            autoFocus
            {...register('address', { required: 'pleaseEnter your address' })}
          />
          {errors.address && (
            <div className='text-red-500'>{errors.address.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='city'>City</label>
          <input
            className='w-full'
            id='city'
            autoFocus
            {...register('city', { required: 'pleaseEnter your city' })}
          />
          {errors.city && (
            <div className='text-red-500'>{errors.city.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='post'>Postal Code</label>
          <input
            className='w-full'
            id='post'
            autoFocus
            {...register('post', { required: 'pleaseEnter your Postal Code' })}
          />
          {errors.post && (
            <div className='text-red-500'>{errors.post.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='country'>Country</label>
          <input
            className='w-full'
            id='country'
            autoFocus
            {...register('country', { required: 'pleaseEnter your country' })}
          />
          {errors.country && (
            <div className='text-red-500'>{errors.country.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <button
            onClick={() => router.push(`${key}/payment`)}
            className='primary-button hover:bg-violet-200 active:bg-amber-500'
          >
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
