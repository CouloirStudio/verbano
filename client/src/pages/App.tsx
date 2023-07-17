import React from "react";
import { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/global.scss";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
