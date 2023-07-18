import React from 'react';
import {type AppProps} from 'next/app';
import '../styles/global.scss';

const MyApp: React.FC<AppProps> = ({Component, pageProps}) => <Component {...pageProps} />;

export default MyApp;
