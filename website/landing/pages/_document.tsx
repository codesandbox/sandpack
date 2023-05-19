import { getSandpackCssText } from "@codesandbox/sandpack-react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

import { getCssText } from "../stitches.config";

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getCssText() }}
            id="stitches"
          />
          <style
            dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
            id="sandpack"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
