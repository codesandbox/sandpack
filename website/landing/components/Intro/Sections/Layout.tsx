/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  useActiveCode,
  SandpackProvider,
  ClasserProvider,
  SandpackPreview,
  SandpackLayout,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Box } from "../../common";

import { useLayoutExampleContext } from "./LayoutContext";
import {
  Wrapper,
  Title,
  Description,
  Container,
  SeeMoreLink,
  SandpackContainerPlaceholder,
  SandpackContainerMobile,
  FadeAnimation,
} from "./common";

export const LayoutExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });

  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const { layoutFiles, setLayoutFiles, setVisibility } =
    useLayoutExampleContext();

  useEffect(() => {
    setLayoutFiles(sandpack.activePath, code);
  }, [code]);

  useEffect(() => {
    Object.entries(layoutFiles).map(([filename, fileCode]) => {
      sandpack.updateFile(filename, fileCode);
    });
  }, []);

  useEffect(() => {
    setVisibility(inView);
  }, [inView]);

  return (
    <FadeAnimation>
      <Wrapper ref={ref}>
        <Container>
          <Title>Build your own Sandpack</Title>
          <Description>
            If you want to fully customise the experience, you can build the UI
            yourself. The library exports a set of composable components and
            hooks that allow you to tailor the editing experience to your own
            needs.
          </Description>

          <Box
            css={{
              position: "relative",
              pre: { padding: 0 },

              ".sp-tabs": {
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },

              ".sp-code-editor": {
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                padding: "0 15px",
              },
            }}
          >
            <SandpackThemeProvider theme="sandpack-dark">
              <SandpackCodeEditor />
            </SandpackThemeProvider>
          </Box>

          <SeeMoreLink href="https://sandpack.codesandbox.io/docs/advanced-usage/components#layout">
            <span>See more</span>
          </SeeMoreLink>
        </Container>
        <SandpackContainerPlaceholder />

        <SandpackContainerMobile
          css={{ width: "100%", ".custom-layout": { height: "5g sta0vh" } }}
        >
          <SandpackProvider
            customSetup={{
              files: layoutFiles,
              dependencies: { "@codesandbox/sandpack-react": "latest" },
            }}
            template="react"
          >
            <ClasserProvider
              classes={{
                "sp-layout": "custom-layout",
                "sp-stack": "custom-stack",
                "sp-wrapper": "custom-wrapper",
              }}
            >
              <SandpackThemeProvider>
                <SandpackLayout>
                  <SandpackPreview />
                </SandpackLayout>
              </SandpackThemeProvider>
            </ClasserProvider>
          </SandpackProvider>
        </SandpackContainerMobile>
      </Wrapper>
    </FadeAnimation>
  );
};
