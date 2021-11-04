import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

import { getCssText } from "../stitches.config";

export default class Document extends NextDocument {
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getCssText() }}
            id="stitches"
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
