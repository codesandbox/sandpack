import {
  CodeEditorRef,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import {
  SandpackThemeProvider,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import { styled } from "@stitches/react";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { sandpackTheme } from "../../../styles/sandpackTheme";

import { Box } from "../../common";
import { useSandpackExample } from "../SandpackExample";

import { Wrapper, Title, Description, Container, SeeMoreLink } from "./common";

const ORIGINAL_CODE = `<Sandpack 
  options={{
    showNavigator: true,
    showLineNumbers: true,
    showTabs: true,
    closableTabs: true,
  }} 
/>`;

const ORIGINAL_CUSTOM = {
  showNavigator: true,
  showLineNumbers: true,
  showTabs: true,
  closableTabs: true,
};

const RefreshButton = styled("button", {
  background: "rgba(136, 136, 136, 0.2)",
  border: "none",
  color: "rgba(255,255,255, .5)",
  borderRadius: "100%",
  width: "24px",
  height: "24px",
  display: "flex",
  padding: 0,
  cursor: "pointer",

  position: "absolute",
  bottom: "12px",
  right: "10px",

  transition: ".2s ease all",

  "&:hover": {
    color: "rgba(255,255,255, 1)",
  },

  svg: {
    padding: "1px",
    margin: "auto",
  },
});

export const EditorExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const { setOptions } = useSandpackExample();
  const [custom, setCustom] = useState(ORIGINAL_CUSTOM);
  const codeEditorRef = useRef<CodeEditorRef>();

  const { sandpack } = useSandpack();
  const { code } = useActiveCode();

  useEffect(() => {
    setOptions({ options: custom });
  }, [custom]);

  useEffect(
    function componentOnView() {
      if (inView && code.length > 43) {
        codeEditorRef.current?.focusEditor({ position: 43 });
      }
    },
    [inView]
  );

  useEffect(function componentMount() {
    sandpack.updateCurrentFile(ORIGINAL_CODE);
  }, []);

  useEffect(
    function listener() {
      const newCustomOptions: Record<string, any> = {};

      Object.keys(custom).map((key) => {
        const value = code.match(new RegExp(`${key}:(.+)`));

        newCustomOptions[key] = value?.[1]?.includes("true") ?? false;
      });

      setCustom((prev) => ({ ...prev, ...(newCustomOptions as any) }));
    },
    [code]
  );

  return (
    <Wrapper ref={ref}>
      <Container>
        <Title>Configure your editor</Title>
        <Description>
          The <code>options</code> prop allows you to toggle on/off different
          features of the code editor.
        </Description>

        <Box
          css={{
            position: "relative",
            pre: { padding: 0 },

            ".sp-code-editor": {
              borderRadius: "16px",
              padding: "15px",
            },
          }}
        >
          <SandpackThemeProvider theme={sandpackTheme}>
            <SandpackCodeEditor ref={codeEditorRef} showTabs={false} />

            <RefreshButton
              onClick={() => {
                sandpack.updateCurrentFile(ORIGINAL_CODE);
                setOptions(ORIGINAL_CUSTOM);
              }}
            >
              <svg
                fill="currentColor"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M16.48 12.8571C16.0883 15.1705 14.1389 16.9286 11.7931 16.9286C9.16499 16.9286 7.03448 14.722 7.03448 12C7.03448 9.27803 9.16499 7.07143 11.7931 7.07143C13.6797 7.07143 15.3099 8.20855 16.0796 9.85714L14.2759 9.85714V11.1429H16.48H16.7586H17.5275H18V6.85714L16.7586 6.85714V8.90778C15.7449 7.16536 13.9004 6 11.7931 6C8.59366 6 6 8.68629 6 12C6 15.3137 8.59366 18 11.7931 18C14.7116 18 17.126 15.7648 17.5275 12.8571H16.48Z"
                  fillRule="evenodd"
                />
              </svg>
            </RefreshButton>
          </SandpackThemeProvider>
        </Box>

        <SeeMoreLink href="https://sandpack.codesandbox.io/docs/getting-started/custom-ui#visual-options">
          <span>See more</span>
        </SeeMoreLink>
      </Container>

      <Box css={{ width: 800 }} />
    </Wrapper>
  );
};
