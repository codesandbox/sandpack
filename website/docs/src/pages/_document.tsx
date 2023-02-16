import { getSandpackCssText } from "@codesandbox/sandpack-react";
import type { DocumentContext, DocumentInitialProps } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
            id="sandpack"
          />
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link href="https://fonts.gstatic.com" rel="preconnect" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <link href="https://sandpack-cdn.codesandbox.io/" rel="preconnect" />

          <link
            href="https://nodebox-runtime.codesandbox.io/"
            rel="preconnect"
          />
        </Head>
        <body className="folderAsHeader cbs">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
