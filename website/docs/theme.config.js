import defaultConfigs from "codesandbox-theme-docs/shared.config.js";

import BackLink from "./src/components/BackLink";
import Logo from "./src/components/Logo";

const OG_IMAGE_URL = "https://sandpack.codesandbox.io/docs/sandpack_og.jpeg";

const config = {
  ...defaultConfigs,
  docsRepositoryBase: "https://codesandbox.io/p/github/codesandbox/sandpack",
  titleSuffix: " - Sandpack",
  project: { icon: BackLink },
  gitTimestamp: null,
  head: (
    <>
      <meta content="#fff" name="msapplication-TileColor" />
      <meta content="en" httpEquiv="Content-Language" />
      <meta
        content="Sandpack is a component toolkit for creating your own live-running code editing experiences powered by CodeSandbox."
        name="description"
      />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@codesandbox" name="twitter:site" />
      <meta content={OG_IMAGE_URL} name="twitter:image" />
      <meta content="Sandpack | CodeSandbox" property="og:title" />
      <meta
        content="Sandpack is a component toolkit for creating your own live-running code editing experiences powered by CodeSandbox."
        property="og:description"
      />
      <meta content="Sandpack" name="apple-mobile-web-app-title" />
    </>
  ),
  getNextSeoProps: () => ({ titleTemplate: "%s – Sandpack" }),
  logo: () => <Logo />,
};

export default config;
