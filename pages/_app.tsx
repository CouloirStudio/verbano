import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../app/components/Layout/index';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && router.pathname === '/login') {
            router.push('/');
        }
    }, [router]);

    const noHeaderSidebar = router.pathname === '/login';

    return (
        <Layout noHeaderSidebar={noHeaderSidebar}>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
