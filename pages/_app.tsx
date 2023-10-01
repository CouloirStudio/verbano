import { useRouter } from 'next/router';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';
import { ProjectProvider } from '../app/contexts/ProjectContext';
import { ApolloProvider } from '@apollo/client';
import client from '../app/config/apolloClient';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginOrRegisterPage = ['/login', '/register'].includes(
    router.pathname,
  );

  return (
    <ApolloProvider client={client}>
      <ProjectProvider>
        {isLoginOrRegisterPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ProjectProvider>
    </ApolloProvider>
  );
}

export default MyApp;
