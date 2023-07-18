import React from 'react';
import {type AppProps} from 'next/app';
import Layout from '../components/Layout';
import '../styles/global.scss';

const App: React.FC<AppProps> = ({Component, pageProps}) => (
	<Layout>
		<Component {...pageProps} />
	</Layout>
);

export default App;
