import "@codesandbox/sandpack-react/dist/index.css";
import amplitude from "amplitude-js";
import type { AppProps } from "next/app";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

if (API_KEY && process.browser) {
  amplitude.getInstance().init(`"${API_KEY}"`);
  amplitude.logEvent("pageview", {
    path: window.location.href,
    source: "sandpack",
  });
}

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />;
}

export default MyApp;
