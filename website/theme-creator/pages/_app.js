import "@codesandbox/sandpack-react/dist/index.css";
import "../styles/globals.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sandpack Customization Tool</title>
        <meta name="description" content="Powered by CodeSandbox" />

        <meta property="og:title" content="Sandpack Customization Tool" />
        <meta property="og:description" content="Powered by CodeSandbox" />
        <meta
          property="og:image"
          content="https://7iydd-3000.pitcher-staging.csb.dev/og-image.jpg"
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
