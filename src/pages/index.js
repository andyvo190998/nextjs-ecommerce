import Layout from '@/components/Layout';
import Product from '@/components/models/Product';
import ProductItem from '@/components/ProductItem';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

export default function Home({ products }) {
  return (
    <Layout title='Home Page'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem key={product.slug} product={product}></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  await db.connect();
  const products = await Product.find().lean();
  console.log(ctx.req.cookies['next-auth.csrf-token']);
  const session = await getSession(ctx);
  return {
    props: {
      products: products.map((product) => db.convertDocToObj(product)),
      session: session || '',
    },
  };
};
