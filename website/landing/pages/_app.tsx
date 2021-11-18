import type { AppProps } from "next/app";
import "@codesandbox/sandpack-react/dist/index.css";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />;
}

export default MyApp;
