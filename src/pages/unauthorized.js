import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import React from 'react';

const unauthorized = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title='unauthorized Page'>
      <h1 className='text-xl'>Access Denied</h1>
      {message && <div className='mb-4 text-red-500'>{message}</div>}
    </Layout>
  );
};

export default unauthorized;
