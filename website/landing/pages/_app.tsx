import "@codesandbox/sandpack-react/dist/index.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />;
}

export default MyApp;
