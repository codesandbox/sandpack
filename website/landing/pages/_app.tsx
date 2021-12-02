import "@codesandbox/sandpack-react/dist/index.css";
import amplitude from "amplitude-js";
import type { AppProps } from "next/app";
import { useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

if (API_KEY && process.browser) {
  amplitude.getInstance().init(API_KEY);
}

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  useEffect(() => {
    amplitude.getInstance().logEvent("pageview", {
      path: window.location.href,
      source: "sandpack",
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
