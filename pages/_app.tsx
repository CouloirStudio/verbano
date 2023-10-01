import { useRouter } from 'next/router';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';
import { ProjectProvider } from '../app/contexts/ProjectContext';
import { ApolloProvider } from '@apollo/client';
import client from '../app/config/apolloClient';
import { ErrorModalContextProvider } from '../app/contexts/ErrorModalContext'; // replace with your import path
import ErrorModal from '../app/components/ErrorModal'; // replace with your import path

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isExcludedPage =
    ['/login', '/register'].includes(router.pathname) ||
    router.pathname.startsWith('/settings');

  const PageContent = (
    <ApolloProvider client={client}>
      <ErrorModalContextProvider>
        <ErrorModal />
        {isExcludedPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ErrorModalContextProvider>
    </ApolloProvider>
  );

  return <ProjectProvider>{PageContent}</ProjectProvider>;
}

export default MyApp;
