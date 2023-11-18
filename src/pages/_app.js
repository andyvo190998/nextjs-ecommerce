import '@/styles/globals.css';
import { StoreProvider } from '@/utils/store';
import { getSession, SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function App({ Component, pageProps }) {
  console.log(pageProps.session, 'asdasd');
  return (
    <SessionProvider
      session={pageProps.session}
      // basePath='/custom-route/api/auth'
      refetchInterval={5 * 60}
    >
      <StoreProvider>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

export default App;

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session: session || '',
    },
  };
};

// App.getInitialProps = async (ctx) => {
//   const cookies = ctx.req.headers.cookie;
//   return {
//     cookies,
//   };
// };

// function Auth({ children }) {
//   const router = useRouter();
//   const { status } = useSession({
//     required: true,
//     onUnauthenticated() {
//       router.push('/unauthorized?message=login required');
//     },
//   });
//   if (status === 'loading') {
//     return <div>Loading ....</div>;
//   }
//   return children;
// }

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}
// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   console.log(session, '123');
//   return {
//     props: { session },
//   };
// };
