/* eslint-disable @typescript-eslint/no-explicit-any */
import amplitude from "amplitude-js";
import { useEffect } from "react";
import "codesandbox-theme-docs/style.css";
import "../styles.css";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

if (API_KEY && process.browser) {
  amplitude.getInstance().init(API_KEY);
}

export default function Nextra({ Component, pageProps }): any {
  const getLayout = Component.getLayout || ((page): any => page);

  useEffect(() => {
    amplitude.getInstance().logEvent("pageview", {
      path: window.location.href,
      source: "sandpack-docs",
    });
  }, []);

  return getLayout(<Component {...pageProps} />);
}
