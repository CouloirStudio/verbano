import React from "react";
import { AppProps } from "next/app";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/global.scss";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
      <Sidebar />
    </div>
  );
};

export default MyApp;
