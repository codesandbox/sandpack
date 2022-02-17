/* eslint-disable @next/next/no-page-custom-font */
import "../styles/globals.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sandpack Theme Builder</title>
        <meta content="Customize your sandpack theme" name="description" />

        <meta content="Sandpack Themes" property="og:title" />
        <meta content="Powered by CodeSandbox" property="og:description" />
        <meta
          content="https://sandpack.codesandbox.io/theme/og-image.jpg"
          property="og:image"
        />

        <link href="/favicon.ico" rel="icon" />

        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="true"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
