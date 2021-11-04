import type { AppProps } from "next/app";
import type { ReactElement } from "react";

import { ThemeProvider } from "../components/ThemeProvider";

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
