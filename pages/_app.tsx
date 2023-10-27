import { useRouter } from 'next/router';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '@/app/components/Layout/MainLayout';
import { ProjectProvider } from '@/app/contexts/ProjectContext';
import { ApolloProvider } from '@apollo/client';
import client from '@/app/config/apolloClient';
import { ErrorModalContextProvider } from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/Modals/ErrorModal';
import { UserProvider } from '@/app/contexts/UserContext';
import CustomThemeProvider from '@/app/contexts/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isExcludedPage =
    ['/login', '/register'].includes(router.pathname) ||
    router.pathname.startsWith('/settings');

  const PageContent = (
    <CustomThemeProvider>
      <ApolloProvider client={client}>
        <UserProvider>
          <ProjectProvider>
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
          </ProjectProvider>
        </UserProvider>
      </ApolloProvider>
    </CustomThemeProvider>
  );

  return PageContent;
}

export default MyApp;
