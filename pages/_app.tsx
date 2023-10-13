import { useRouter } from 'next/router';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';
import { ProjectProvider } from '../app/contexts/ProjectContext';
import { ApolloProvider } from '@apollo/client';
import client from '../app/config/apolloClient';
import { ErrorModalContextProvider } from '../app/contexts/ErrorModalContext';
import ErrorModal from '../app/components/ErrorModal';
import { UserProvider } from '../app/components/UserProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isExcludedPage =
    ['/login', '/register'].includes(router.pathname) ||
    router.pathname.startsWith('/settings');

  const PageContent = (
    <ApolloProvider client={client}>
      <UserProvider>
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
      </UserProvider>
    </ApolloProvider>
  );

  return (
    <ApolloProvider client={client}>
      <ProjectProvider>{PageContent}</ProjectProvider>
    </ApolloProvider>
  );
}

export default MyApp;
