/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  useActiveCode,
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { useEffect, useLayoutEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CardTitle, CardDescription } from "../../common";

import { useLayoutExampleContext } from "./LayoutContext";
import {
  Row,
  Content,
  CodeWrapper,
  SandpackContainerPlaceholder,
  SandpackContainerMobile,
  FadeAnimation,
  THRESHOLD_VIEW,
  Caption,
} from "./common";

export const LayoutExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: THRESHOLD_VIEW });

  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const { layoutFiles, setLayoutFiles, setVisibility } =
    useLayoutExampleContext();

  useLayoutEffect(() => {
    setLayoutFiles(sandpack.activeFile, code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, sandpack.activeFile]);

  useEffect(() => {
    Object.entries(layoutFiles).forEach(([filename, fileCode]) => {
      sandpack.updateFile(filename, fileCode);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setVisibility(inView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <FadeAnimation>
      <Row ref={ref}>
        <Content>
          <CardTitle>Build your own Sandpack UI</CardTitle>
          <CardDescription>
            To fully customize the experience, you can build the UI yourself.
            The library exports a set of{" "}
            <a
              className="external-link"
              href="https://sandpack.codesandbox.io/docs/advanced-usage/components#layout"
              rel="noreferrer"
              target="_blank"
            >
              composable components
            </a>{" "}
            and hooks that allow you to tailor the editing experience to your
            own needs.
          </CardDescription>

          <CodeWrapper
            css={{
              ".sp-wrapper": {
                height: "420px",
              },

              ".sp-tabs": {
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },

              ".sp-code-editor": {
                borderRadius: 0,
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              },
              ".sp-cm": {
                height: "380px",
              },
            }}
          >
            <Caption>Code snippet</Caption>
            <SandpackThemeProvider theme={sandpackDark}>
              <SandpackCodeEditor showInlineErrors />
            </SandpackThemeProvider>
          </CodeWrapper>
        </Content>

        <SandpackContainerMobile css={{ ".custom-layout": { height: "50vh" } }}>
          <Caption>Sandpack preview</Caption>
          <SandpackProvider
            customSetup={{
              dependencies: { "@codesandbox/sandpack-react": "latest" },
            }}
            files={layoutFiles}
            options={{
              classes: {
                "sp-layout": "custom-layout",
                "sp-stack": "custom-stack",
                "sp-wrapper": "custom-wrapper",
              },
            }}
            template="react"
          >
            <SandpackLayout>
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
        </SandpackContainerMobile>

        <SandpackContainerPlaceholder />
      </Row>
    </FadeAnimation>
  );
};
