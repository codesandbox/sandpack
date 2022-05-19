/* eslint-disable @typescript-eslint/no-explicit-any */
import amplitude from "amplitude-js";
import type { AppProps } from "next/app";
import { useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

if (API_KEY && process.browser) {
  amplitude.getInstance().init(API_KEY);
}

const MyApp: React.FC<AppProps & { Component: any }> = ({
  Component,
  pageProps,
}) => {
  useEffect(() => {
    amplitude.getInstance().logEvent("pageview", {
      path: window.location.href,
      source: "sandpack",
    });
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
