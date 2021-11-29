import "@codesandbox/sandpack-react/dist/index.css";
import "../styles/globals.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sandpack Theme Builder</title>
        <meta name="description" content="Customize your sandpack theme" />

        <meta property="og:title" content="Sandpack Themes" />
        <meta property="og:description" content="Powered by CodeSandbox" />
        <meta
          property="og:image"
          content="https://sandpack.codesandbox.io/theme/og-image.jpg"
        />

        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
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
