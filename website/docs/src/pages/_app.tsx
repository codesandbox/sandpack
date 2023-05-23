import amplitude from "amplitude-js";
import { useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

if (API_KEY && process.browser) {
  amplitude.getInstance().init(API_KEY);
}

function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    amplitude.getInstance().logEvent("Pageview");
  }, []);

  return getLayout(<Component {...pageProps} />);
}

export default App;
