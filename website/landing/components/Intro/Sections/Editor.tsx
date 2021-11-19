import type {
  SandpackPredefinedTemplate,
  CodeEditorRef,
} from "@codesandbox/sandpack-react";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackThemeProvider,
  CodeEditor,
} from "@codesandbox/sandpack-react";
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
    showInlineErrors: true,
    showTabs: true,
    closableTabs: true,
    wrapContent: true,
  }} 
/>`;
const ORIGINAL_CUSTOM = {
  showNavigator: true,
  showLineNumbers: true,
  showInlineErrors: true,
  showTabs: true,
  closableTabs: true,
  wrapContent: true,
};

export const EditorExample: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const { setOptions } = useSandpackExample();
  const [custom, setCustom] = useState(ORIGINAL_CUSTOM);
  const codeEditorRef = useRef<CodeEditorRef>();
  const code = useRef(ORIGINAL_CODE);

  useEffect(() => {
    setOptions({ options: custom });
  }, [custom]);

  useEffect(() => {
    if (inView) {
      codeEditorRef.current?.focusEditor({ position: 43 });
    }
  }, [inView]);

  const handleCodeUpdate = (newCode: string) => {
    const newCustomOptions: Record<string, any> = {};

    Object.keys(custom).map((key) => {
      const value = newCode.match(new RegExp(`${key}:(.+)`));

      newCustomOptions[key] = value?.[1]?.includes("true") ?? false;
    });

    setCustom((prev) => ({ ...prev, ...(newCustomOptions as any) }));
  };

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
            pre: { padding: 0 },

            ".cm-editor": {
              borderRadius: "16px",
              padding: "15px",
            },
          }}
        >
          <SandpackProvider>
            <SandpackThemeProvider theme={sandpackTheme}>
              <CodeEditor
                ref={codeEditorRef}
                code={code.current}
                onCodeUpdate={handleCodeUpdate}
              />
            </SandpackThemeProvider>
          </SandpackProvider>
        </Box>

        <SeeMoreLink href="https://sandpack.codesandbox.io/docs/getting-started/custom-ui#visual-options">
          <span>See more</span>
        </SeeMoreLink>
      </Container>

      <Box css={{ width: 800 }} />
    </Wrapper>
  );
};
