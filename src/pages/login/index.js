import Layout from '@/components/Layout';
// import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '@/utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { redirect } = router.query;

  const [login, setLogin] = useState(true);
  const nameInput = useRef();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, router, session]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    if (login) {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (result.error) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error(getError.error);
      }
    } else {
      const userName = nameInput.current.value;
      const newUser = {
        name: userName,
        email: email,
        password: password,
      };
      if (!userName || !email || !password) {
        alert('Please enter all the input');
      } else {
        await axios
          .post('/api/users', newUser)
          .then((res) => alert(res.data))
          .catch((err) => alert(err.response.data));
      }
    }
  };

  return (
    <Layout title='Login'>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className='mx-auto max-w-screen-md'
      >
        <h1 className='mb-4 text-xl'>{login ? 'Login' : 'Register'}</h1>
        {!login && (
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
        )}
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email!',
              },
            })}
            className='w-full'
            id='email'
            autoFocus
          ></input>
          {errors.email && (
            <div className='text-red-500'>{errors.email.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            {...register('password', {
              required: 'Please enter password',
              minLength: {
                value: 6,
                message: 'Password is more than 5 characters',
              },
            })}
            className='w-full'
            id='password'
            autoFocus
          ></input>
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <button className='primary-button'>
            {login ? 'Login' : 'Register'}
          </button>
        </div>
      </form>
      {login ? (
        <div className='mb-4'>
          Don&apos;t have an account? &nbsp;
          <button className='text-blue-500' onClick={() => setLogin(false)}>
            Register here
          </button>
        </div>
      ) : (
        <div className='mb-4'>
          You already have an account? &nbsp;
          <button className='text-blue-500' onClick={() => setLogin(true)}>
            Login here
          </button>
        </div>
      )}
    </Layout>
  );
};

export default LoginScreen;
