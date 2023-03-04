import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 justify-between shadow-md items-center px-4'>
            <Link href='/'>
              <p href='' className='text-lg font-bold'>
                amazona
              </p>
            </Link>
            <div>
              <Link href='/cart'>
                <span className='p-2'>Cart</span>
              </Link>
              <Link href='/login'>
                <span className='p-2'>Login</span>
              </Link>
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex justify-center items-center h-10 shadow-inner'>
          <span>Copyright @ 2023 Amazona</span>
        </footer>
      </div>
    </>
  );
}
